import type { Market, Period } from "@/contracts/dataset";
import { timeline } from "./aggregate";
import { marketsInScope, type DatasetIndex } from "./dataset-index";
import { marketScope } from "./hierarchy";
import { pctChange } from "./math";
import type { Scope } from "./scope";

export interface MatrixCell {
  period: Period;
  value: number | null;
  anomaly: string | null;
}

export interface MatrixRow {
  market: Market;
  cells: MatrixCell[];
}

export function growthMatrix(index: DatasetIndex, scope: Scope): MatrixRow[] {
  return marketsInScope(index, scope).map((market) => {
    const notes = new Map(market.kpis.anomalies.map((a) => [a.period, a.note]));
    const points = timeline(index, marketScope(index, market.id, scope.productId));
    return {
      market,
      cells: points.map((p) => ({
        period: p.period,
        value: pctChange(p.actual, p.priorYear),
        anomaly: notes.get(p.period) ?? null,
      })),
    };
  });
}
