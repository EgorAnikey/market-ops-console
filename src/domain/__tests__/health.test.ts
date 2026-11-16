import { describe, expect, it } from "vitest";
import { testIndex } from "@/test/dataset";
import { atRiskMarkets, marketHealth, riskReasons } from "../health";
import { growthMatrix } from "../matrix";
import { PORTFOLIO_SCOPE } from "../scope";

describe("market health", () => {
  const health = marketHealth(testIndex, PORTFOLIO_SCOPE, testIndex.latestPeriod);

  it("ranks off-track markets before at-risk ones", () => {
    const risky = atRiskMarkets(health);
    expect(risky[0]?.kpis.status).toBe("off_track");
    expect(risky.map((h) => h.market.id)).toEqual(expect.arrayContaining(["de", "it", "br"]));
  });

  it("explains Germany's risk, including the March anomaly", () => {
    const de = health.find((h) => h.market.id === "de")!;
    expect(riskReasons(de).map((r) => r.type)).toEqual(["attainment", "growth", "anomaly"]);
  });

  it("builds a markets × periods growth matrix with anomaly notes", () => {
    const matrix = growthMatrix(testIndex, PORTFOLIO_SCOPE);
    expect(matrix).toHaveLength(13);
    const de = matrix.find((r) => r.market.id === "de")!;
    expect(de.cells).toHaveLength(24);
    expect(de.cells.find((c) => c.period === "2026-03")?.anomaly).toMatch(/27%/);
  });
});
