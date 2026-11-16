import type { Anomaly, Market, Period } from "@/contracts/dataset";
import { timeline } from "./aggregate";
import { marketsInScope, previousPeriod, type DatasetIndex } from "./dataset-index";
import { marketScope } from "./hierarchy";
import { kpisFromTimeline, type Kpis } from "./kpis";
import { pctChange } from "./math";
import type { Scope } from "./scope";
import { STATUS_RULE, STATUS_SEVERITY, needsAttention } from "./status";

export interface MarketHealth {
  market: Market;
  kpis: Kpis;
  changePct: number | null;
  anomalies: Anomaly[];
}

export type RiskReason =
  | { type: "attainment"; value: number }
  | { type: "growth"; value: number }
  | { type: "anomaly"; anomaly: Anomaly };

export function marketHealth(index: DatasetIndex, scope: Scope, period: Period): MarketHealth[] {
  const prev = previousPeriod(index, period);
  return marketsInScope(index, scope).map((market) => {
    const mScope = marketScope(index, market.id, scope.productId);
    const points = timeline(index, mScope);
    const kpis = kpisFromTimeline(index, mScope, points, period);
    const prevActual = prev ? points.find((p) => p.period === prev)?.actual : undefined;
    return {
      market,
      kpis,
      changePct: pctChange(kpis.revenue, prevActual),
      anomalies: market.kpis.anomalies.filter((a) => a.period <= period),
    };
  });
}

export function atRiskMarkets(health: readonly MarketHealth[]): MarketHealth[] {
  return health
    .filter((h) => needsAttention(h.kpis.status))
    .sort(
      (a, b) =>
        STATUS_SEVERITY[b.kpis.status] - STATUS_SEVERITY[a.kpis.status] ||
        (a.kpis.forecastAttainmentPct ?? 0) - (b.kpis.forecastAttainmentPct ?? 0),
    );
}

export function riskReasons(h: MarketHealth): RiskReason[] {
  const reasons: RiskReason[] = [];
  const { forecastAttainmentPct: att, growthPct: growth } = h.kpis;
  if (att !== null && att < STATUS_RULE.atRisk.attainmentBelowPct)
    reasons.push({ type: "attainment", value: att });
  if (growth !== null && growth < STATUS_RULE.atRisk.growthBelowPct)
    reasons.push({ type: "growth", value: growth });
  for (const anomaly of h.anomalies) reasons.push({ type: "anomaly", anomaly });
  return reasons;
}

export interface Movers {
  gainers: MarketHealth[];
  decliners: MarketHealth[];
}

export function topMovers(health: readonly MarketHealth[], n = 3): Movers {
  const ranked = health
    .filter((h): h is MarketHealth & { changePct: number } => h.changePct !== null)
    .sort((a, b) => b.changePct - a.changePct);
  return {
    gainers: ranked.filter((h) => h.changePct > 0).slice(0, n),
    decliners: ranked
      .filter((h) => h.changePct < 0)
      .reverse()
      .slice(0, n),
  };
}
