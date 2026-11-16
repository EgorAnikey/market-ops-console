import { describe, expect, it } from "vitest";
import { testDataset } from "@/test/dataset";
import { deriveStatus } from "../status";

describe("deriveStatus", () => {
  it.each(testDataset.markets.map((m) => [m.name, m.kpis] as const))(
    "reproduces the canonical status for %s",
    (_name, kpis) => {
      expect(deriveStatus(kpis.growthPct, kpis.forecastAttainmentPct)).toBe(kpis.status);
    },
  );
});
