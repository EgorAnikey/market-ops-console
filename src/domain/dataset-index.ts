import type { Dataset, Market, Period, Product, Region, SeriesRow } from "@/contracts/dataset";
import type { Scope } from "./scope";

export interface DatasetIndex {
  readonly dataset: Dataset;
  readonly periods: readonly Period[];
  readonly latestPeriod: Period;
  readonly currency: string;
  readonly regionsById: ReadonlyMap<string, Region>;
  readonly marketsById: ReadonlyMap<string, Market>;
  readonly productsById: ReadonlyMap<string, Product>;
  readonly marketsByRegion: ReadonlyMap<string, readonly Market[]>;
}

export function createDatasetIndex(dataset: Dataset): DatasetIndex {
  const marketsByRegion = new Map<string, Market[]>();
  for (const market of dataset.markets) {
    const list = marketsByRegion.get(market.regionId) ?? [];
    list.push(market);
    marketsByRegion.set(market.regionId, list);
  }
  return {
    dataset,
    periods: dataset.meta.periods,
    latestPeriod: dataset.meta.latestPeriod,
    currency: dataset.meta.currency,
    regionsById: new Map(dataset.regions.map((r) => [r.id, r])),
    marketsById: new Map(dataset.markets.map((m) => [m.id, m])),
    productsById: new Map(dataset.products.map((p) => [p.id, p])),
    marketsByRegion,
  };
}

export function marketsInScope(index: DatasetIndex, scope: Scope): Market[] {
  if (scope.marketId) {
    const market = index.marketsById.get(scope.marketId);
    return market ? [market] : [];
  }
  if (scope.regionId) return [...(index.marketsByRegion.get(scope.regionId) ?? [])];
  return [...index.dataset.markets];
}

export function rowsInScope(index: DatasetIndex, scope: Scope): SeriesRow[] {
  const marketIds = new Set(marketsInScope(index, scope).map((m) => m.id));
  return index.dataset.series.filter(
    (row) => marketIds.has(row.marketId) && (!scope.productId || row.productId === scope.productId),
  );
}

export function isKnownPeriod(index: DatasetIndex, period: string): period is Period {
  return index.periods.includes(period);
}

export function previousPeriod(index: DatasetIndex, period: Period, offset = 1): Period | null {
  const i = index.periods.indexOf(period);
  return i - offset >= 0 ? (index.periods[i - offset] ?? null) : null;
}
