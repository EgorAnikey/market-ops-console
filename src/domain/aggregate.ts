import type { Period, SeriesRow } from "@/contracts/dataset";
import { rowsInScope, type DatasetIndex } from "./dataset-index";
import { scopeKey, type Scope } from "./scope";

export interface Totals {
  actual: number;
  forecast: number;
  priorYear: number;
  units: number;
}

export interface PeriodPoint extends Totals {
  period: Period;
}

const emptyTotals = (): Totals => ({ actual: 0, forecast: 0, priorYear: 0, units: 0 });

function addRow(into: Totals, row: SeriesRow): void {
  into.actual += row.actual;
  into.forecast += row.forecast;
  into.priorYear += row.priorYear;
  into.units += row.units;
}

const cache = new WeakMap<DatasetIndex, Map<string, readonly PeriodPoint[]>>();

export function timeline(index: DatasetIndex, scope: Scope): readonly PeriodPoint[] {
  const perIndex = cache.get(index) ?? new Map<string, readonly PeriodPoint[]>();
  cache.set(index, perIndex);
  const key = scopeKey(scope);
  const hit = perIndex.get(key);
  if (hit) return hit;

  const byPeriod = new Map<Period, Totals>(index.periods.map((p) => [p, emptyTotals()]));
  for (const row of rowsInScope(index, scope)) {
    const bucket = byPeriod.get(row.period);
    if (bucket) addRow(bucket, row);
  }
  const points = Object.freeze(
    index.periods.map((period) => ({ period, ...(byPeriod.get(period) ?? emptyTotals()) })),
  );
  perIndex.set(key, points);
  return points;
}

export function totalsAt(points: readonly PeriodPoint[], period: Period): Totals {
  return points.find((p) => p.period === period) ?? emptyTotals();
}

export function sumWindow(points: readonly PeriodPoint[], endPeriod: Period, size: number): number | null {
  const end = points.findIndex((p) => p.period === endPeriod);
  if (end < 0 || end - size + 1 < 0) return null;
  return points.slice(end - size + 1, end + 1).reduce((acc, p) => acc + p.actual, 0);
}
