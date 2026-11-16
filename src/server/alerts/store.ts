import "server-only";
import type { AlertRule, AlertRulePayload } from "@/contracts/alerts";

const SEED: AlertRule = {
  id: "seed-eu-attainment",
  createdAt: "2026-06-01T09:00:00.000Z",
  name: "Europe attainment watch",
  scope: "region:eu",
  match: "any",
  severity: "warning",
  conditions: [{ metric: "forecastAttainmentPct", operator: "lt", threshold: 95 }],
  channels: { inApp: true, email: false },
  recipients: [],
};

const shared = globalThis as typeof globalThis & { __alertRules?: Map<string, AlertRule> };
const rules = (shared.__alertRules ??= new Map([[SEED.id, SEED]]));

export const alertStore = {
  list(): AlertRule[] {
    return [...rules.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  create(payload: AlertRulePayload): AlertRule {
    const rule: AlertRule = { ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    rules.set(rule.id, rule);
    return rule;
  },
  remove(id: string): boolean {
    return rules.delete(id);
  },
};
