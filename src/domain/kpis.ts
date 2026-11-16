import type { Period, Status } from "@/contracts/dataset";
import { sumWindow, timeline, totalsAt, type PeriodPoint } from "./aggregate";
import { marketsInScope, type DatasetIndex } from "./dataset-index";
import { pctChange, ratioPct, round1 } from "./math";
import { scopeLevel, type Scope } from "./scope";
import { deriveStatus } from "./status";

export interface Kpis {
  revenue: number;
  forecast: number;
  priorYear: number;
  units: number;
  growthPct: number | null;
  forecastAttainmentPct: number | null;
  sharePct: number | null;
  momentumPct: number | null;
  status: Status;
  canonical: boolean;
}

function shareFor(index: DatasetIndex, scope: Scope): number | null {
  if (scope.productId) return null;
  const markets = marketsInScope(index, scope);
  const weight = markets.reduce((acc, m) => acc + m.kpis.revenue, 0);
  if (!weight) return null;
  return round1(markets.reduce((acc, m) => acc + m.kpis.sharePct * m.kpis.revenue, 0) / weight);
}

function momentum(points: readonly PeriodPoint[], period: Period): number | null {
  const recent = sumWindow(points, period, 3);
  const i = points.findIndex((p) => p.period === period);
  const before = i >= 3 ? sumWindow(points, points[i - 3]!.period, 3) : null;
  return recent === null || before === null ? null : pctChange(recent, before);
}

export function kpisFromTimeline(
  index: DatasetIndex,
  scope: Scope,
  points: readonly PeriodPoint[],
  period: Period,
): Kpis {
  const t = totalsAt(points, period);
  const derived = {
    revenue: t.actual,
    forecast: t.forecast,
    priorYear: t.priorYear,
    units: t.units,
    growthPct: pctChange(t.actual, t.priorYear),
    forecastAttainmentPct: ratioPct(t.actual, t.forecast),
    sharePct: shareFor(index, scope),
    momentumPct: momentum(points, period),
  };

  const market = scope.marketId ? index.marketsById.get(scope.marketId) : undefined;
  if (market && scopeLevel(scope) === "market" && period === index.latestPeriod) {
    const k = market.kpis;
    return {
      ...derived,
      revenue: k.revenue,
      growthPct: k.growthPct,
      forecastAttainmentPct: k.forecastAttainmentPct,
      sharePct: k.sharePct,
      status: k.status,
      canonical: true,
    };
  }
  return {
    ...derived,
    status: deriveStatus(derived.growthPct, derived.forecastAttainmentPct),
    canonical: false,
  };
}

export function computeKpis(index: DatasetIndex, scope: Scope, period: Period): Kpis {
  return kpisFromTimeline(index, scope, timeline(index, scope), period);
}
