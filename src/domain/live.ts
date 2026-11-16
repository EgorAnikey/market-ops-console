import type { Dataset } from "@/contracts/dataset";
import type { LiveTick } from "@/contracts/live";

const rowKey = (marketId: string, productId: string) => `${marketId}:${productId}`;

export function applyLiveTick(dataset: Dataset, tick: LiveTick): Dataset {
  if (tick.period !== dataset.meta.latestPeriod) return dataset;
  const rows = new Map(tick.rows.map((r) => [rowKey(r.marketId, r.productId), r]));
  const markets = new Map(tick.markets.map((m) => [m.id, m.kpis]));

  return {
    ...dataset,
    markets: dataset.markets.map((market) => {
      const kpis = markets.get(market.id);
      return kpis ? { ...market, kpis: { ...kpis, anomalies: market.kpis.anomalies } } : market;
    }),
    series: dataset.series.map((row) => {
      const live = row.period === tick.period ? rows.get(rowKey(row.marketId, row.productId)) : undefined;
      return live ? { ...row, actual: live.actual, units: live.units } : row;
    }),
  };
}
