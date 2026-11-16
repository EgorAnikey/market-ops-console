import "server-only";
import type { Dataset, Market, SeriesRow } from "@/contracts/dataset";
import type { LiveMarket, LiveRow, LiveTick } from "@/contracts/live";
import { round1 } from "@/domain/math";
import { deriveStatus } from "@/domain/status";

const MARKET_SWING = 0.06;
const PRODUCT_SWING = 0.02;

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0) / 2 ** 32;
}

function wave(key: string, tick: number, minPeriod: number, maxPeriod: number): number {
  const period = minPeriod + hash(`${key}#period`) * (maxPeriod - minPeriod);
  return Math.sin((2 * Math.PI * tick) / period + 2 * Math.PI * hash(`${key}#phase`));
}

export function liveFactor(marketId: string, productId: string, tick: number): number {
  const market = 1 + MARKET_SWING * wave(marketId, tick, 6, 14);
  const product = 1 + PRODUCT_SWING * wave(`${marketId}:${productId}`, tick, 3, 6);
  return market * product;
}

function liveRow(row: SeriesRow, tick: number): LiveRow {
  const f = liveFactor(row.marketId, row.productId, tick);
  return {
    marketId: row.marketId,
    productId: row.productId,
    actual: Math.round(row.actual * f),
    units: Math.round(row.units * f),
  };
}

function liveMarket(market: Market, base: readonly SeriesRow[], live: readonly LiveRow[]): LiveMarket {
  const sum = (rows: readonly { marketId: string; actual: number }[]) =>
    rows.reduce((acc, r) => (r.marketId === market.id ? acc + r.actual : acc), 0);
  const baseRevenue = sum(base);
  const ratio = baseRevenue ? sum(live) / baseRevenue : 1;
  const k = market.kpis;
  const growthPct = round1(((1 + k.growthPct / 100) * ratio - 1) * 100);
  const forecastAttainmentPct = round1(k.forecastAttainmentPct * ratio);
  return {
    id: market.id,
    kpis: {
      revenue: Math.round(k.revenue * ratio),
      growthPct,
      sharePct: round1(k.sharePct * ratio),
      forecastAttainmentPct,
      status: deriveStatus(growthPct, forecastAttainmentPct),
    },
  };
}

export function liveTick(dataset: Dataset, tick: number, at: Date): LiveTick {
  const period = dataset.meta.latestPeriod;
  const base = dataset.series.filter((r) => r.period === period);
  const rows = base.map((r) => liveRow(r, tick));
  return {
    type: "tick",
    tick,
    at: at.toISOString(),
    period,
    rows,
    markets: dataset.markets.map((m) => liveMarket(m, base, rows)),
  };
}
