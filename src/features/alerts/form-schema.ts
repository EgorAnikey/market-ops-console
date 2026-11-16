import { z } from "zod";
import {
  alertRuleShape,
  checkRuleInvariants,
  MAX_RECIPIENTS,
  type AlertRulePayload,
} from "@/contracts/alerts";

export const parseRecipients = (text: string): string[] =>
  text
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);

const email = z.email();

export const alertFormSchema = z
  .object({ ...alertRuleShape, recipients: z.string() })
  .superRefine((rule, ctx) => {
    const recipients = parseRecipients(rule.recipients);
    const invalid = recipients.find((r) => !email.safeParse(r).success);
    if (invalid)
      ctx.addIssue({ code: "custom", path: ["recipients"], message: `“${invalid}” is not a valid email` });
    if (recipients.length > MAX_RECIPIENTS) {
      ctx.addIssue({ code: "custom", path: ["recipients"], message: `At most ${MAX_RECIPIENTS} recipients` });
    }
    checkRuleInvariants(rule, recipients.length, ctx);
  });

export type AlertFormValues = z.infer<typeof alertFormSchema>;

export const toPayload = (values: AlertFormValues): AlertRulePayload => ({
  ...values,
  name: values.name.trim(),
  recipients: values.channels.email ? parseRecipients(values.recipients) : [],
});

export const DEFAULT_ALERT_VALUES: AlertFormValues = {
  name: "",
  scope: "portfolio",
  match: "any",
  severity: "warning",
  conditions: [
    { metric: "growthPct", operator: "lt", threshold: 0 },
    { metric: "forecastAttainmentPct", operator: "lt", threshold: 95 },
  ],
  channels: { inApp: true, email: false },
  recipients: "",
};
