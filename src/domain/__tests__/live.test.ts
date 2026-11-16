import { describe, expect, it } from "vitest";
import type { LiveTick } from "@/contracts/live";
import { testDataset } from "@/test/dataset";
import { applyLiveTick } from "../live";

const latest = testDataset.meta.latestPeriod;
const product = testDataset.products[0]!.id;

const tick: LiveTick = {
  type: "tick",
  tick: 1,
  at: "2026-06-01T12:00:00.000Z",
  period: latest,
  rows: [{ marketId: "de", productId: product, actual: 1, units: 2 }],
  markets: [
    {
      id: "de",
      kpis: { revenue: 123, growthPct: 5, sharePct: 9, forecastAttainmentPct: 101, status: "on_track" },
    },
  ],
};

const rowOf = (period: string, dataset = testDataset) =>
  dataset.series.find((r) => r.marketId === "de" && r.productId === product && r.period === period);

describe("applyLiveTick", () => {
  it("replaces the latest month's rows and market KPIs without touching anything else", () => {
    const before = structuredClone(testDataset);
    const next = applyLiveTick(testDataset, tick);
    expect(testDataset).toEqual(before);
    const original = rowOf(latest);

    expect(rowOf(latest, next)).toEqual({ ...original, actual: 1, units: 2 });
    const earlier = testDataset.meta.periods.at(-2)!;
    expect(rowOf(earlier, next)).toBe(rowOf(earlier));

    const de = next.markets.find((m) => m.id === "de")!;
    const deBefore = testDataset.markets.find((m) => m.id === "de")!;
    expect(de.kpis).toMatchObject({ revenue: 123, status: "on_track" });
    expect(de.kpis.anomalies).toBe(deBefore.kpis.anomalies);
    expect(next.markets.find((m) => m.id === "us")).toBe(testDataset.markets.find((m) => m.id === "us"));
  });
});
