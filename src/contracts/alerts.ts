import { z } from "zod";

export const ALERT_METRICS = ["growthPct", "forecastAttainmentPct", "sharePct"] as const;
export const alertMetricSchema = z.enum(ALERT_METRICS);
export type AlertMetric = z.infer<typeof alertMetricSchema>;

export const METRIC_BOUNDS: Record<AlertMetric, { min: number; max: number }> = {
  growthPct: { min: -100, max: 100 },
  forecastAttainmentPct: { min: 0, max: 200 },
  sharePct: { min: 0, max: 100 },
};

export const alertConditionSchema = z
  .object({
    metric: alertMetricSchema,
    operator: z.enum(["lt", "gt"]),
    threshold: z.number({ error: "Enter a number" }).finite(),
  })
  .superRefine((c, ctx) => {
    const { min, max } = METRIC_BOUNDS[c.metric];
    if (c.threshold < min || c.threshold > max) {
      ctx.addIssue({ code: "custom", path: ["threshold"], message: `Must be between ${min} and ${max}` });
    }
  });
export type AlertCondition = z.infer<typeof alertConditionSchema>;

export const alertScopeSchema = z.string().regex(/^(portfolio|region:[a-z]+|market:[a-z]+)$/, "Pick a scope");

export const alertRuleShape = {
  name: z.string().trim().min(3, "At least 3 characters").max(60, "At most 60 characters"),
  scope: alertScopeSchema,
  match: z.enum(["any", "all"]),
  severity: z.enum(["warning", "critical"]),
  conditions: z
    .array(alertConditionSchema)
    .min(1, "Add at least one condition")
    .max(4, "At most 4 conditions"),
  channels: z.object({ inApp: z.boolean(), email: z.boolean() }),
};

export const MAX_RECIPIENTS = 10;

type RuleCore = { conditions: AlertCondition[]; channels: { inApp: boolean; email: boolean } };

export function checkRuleInvariants(rule: RuleCore, recipientCount: number, ctx: z.RefinementCtx): void {
  const seen = new Set<string>();
  rule.conditions.forEach((c, i) => {
    const key = `${c.metric}:${c.operator}`;
    if (seen.has(key))
      ctx.addIssue({ code: "custom", path: ["conditions", i, "metric"], message: "Duplicate condition" });
    seen.add(key);
  });
  if (!rule.channels.inApp && !rule.channels.email) {
    ctx.addIssue({ code: "custom", path: ["channels"], message: "Choose at least one channel" });
  }
  if (rule.channels.email && recipientCount === 0) {
    ctx.addIssue({ code: "custom", path: ["recipients"], message: "Add at least one recipient" });
  }
}

export const alertRulePayloadSchema = z
  .object({ ...alertRuleShape, recipients: z.array(z.email()).max(MAX_RECIPIENTS) })
  .superRefine((rule, ctx) => checkRuleInvariants(rule, rule.recipients.length, ctx));
export type AlertRulePayload = z.infer<typeof alertRulePayloadSchema>;

export const alertRuleSchema = alertRulePayloadSchema.and(
  z.object({ id: z.string(), createdAt: z.string() }),
);
export type AlertRule = z.infer<typeof alertRuleSchema>;

export const SIMULATE_FAILURE_HEADER = "x-simulate-failure";
