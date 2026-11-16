import { describe, expect, it } from "vitest";
import { testIndex } from "@/test/dataset";
import { marketScope } from "../hierarchy";
import { computeKpis } from "../kpis";
import { PORTFOLIO_SCOPE } from "../scope";

const latest = testIndex.latestPeriod;

describe("computeKpis", () => {
  it("uses canonical data.json KPIs for a market at the latest period", () => {
    const kpis = computeKpis(testIndex, marketScope(testIndex, "de"), latest);
    expect(kpis).toMatchObject({ canonical: true, revenue: 1676586, growthPct: -9.7, status: "off_track" });
  });

  it("derives KPIs from the series for earlier periods", () => {
    const kpis = computeKpis(testIndex, marketScope(testIndex, "de"), "2026-03");
    expect(kpis.canonical).toBe(false);
    expect(kpis.growthPct).toBeLessThan(-20);
    expect(kpis.status).toBe("off_track");
  });

  it("portfolio revenue equals the sum of market revenue", () => {
    const portfolio = computeKpis(testIndex, PORTFOLIO_SCOPE, latest);
    const sum = testIndex.dataset.markets.reduce(
      (acc, m) =>
        acc + computeKpis(testIndex, { ...marketScope(testIndex, m.id), productId: null }, "2026-04").revenue,
      0,
    );
    expect(computeKpis(testIndex, PORTFOLIO_SCOPE, "2026-04").revenue).toBe(sum);
    expect(portfolio.growthPct).toBeGreaterThan(0);
  });
});
