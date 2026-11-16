import type { AlertCondition, AlertRulePayload } from "@/contracts/alerts";
import type { Market, Period } from "@/contracts/dataset";
import type { DatasetIndex } from "./dataset-index";
import { marketHealth, type MarketHealth } from "./health";
import { marketScope, regionScope } from "./hierarchy";
import { PORTFOLIO_SCOPE, type Scope } from "./scope";

export function alertScopeToScope(index: DatasetIndex, scope: string): Scope {
  const [level, id] = scope.split(":");
  if (level === "region" && id) return regionScope(id);
  if (level === "market" && id) return marketScope(index, id);
  return PORTFOLIO_SCOPE;
}

export function conditionHolds(h: MarketHealth, c: AlertCondition): boolean {
  const value = h.kpis[c.metric];
  if (value === null) return false;
  return c.operator === "lt" ? value < c.threshold : value > c.threshold;
}

type EvaluableRule = Pick<AlertRulePayload, "scope" | "match" | "conditions">;

export function evaluateRule(index: DatasetIndex, rule: EvaluableRule, period: Period): Market[] {
  if (rule.conditions.length === 0) return [];
  const health = marketHealth(index, alertScopeToScope(index, rule.scope), period);
  return health
    .filter((h) =>
      rule.match === "all"
        ? rule.conditions.every((c) => conditionHolds(h, c))
        : rule.conditions.some((c) => conditionHolds(h, c)),
    )
    .map((h) => h.market);
}
