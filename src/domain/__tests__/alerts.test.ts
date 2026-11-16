import { describe, expect, it } from "vitest";
import { testIndex } from "@/test/dataset";
import { evaluateRule } from "../alerts";

const latest = testIndex.latestPeriod;

describe("evaluateRule", () => {
  it("flags markets matching any condition", () => {
    const flagged = evaluateRule(
      testIndex,
      {
        scope: "portfolio",
        match: "any",
        conditions: [{ metric: "growthPct", operator: "lt", threshold: 0 }],
      },
      latest,
    );
    expect(flagged.map((m) => m.id).sort()).toEqual(["de", "es"]);
  });

  it("requires every condition when match is 'all' and respects scope", () => {
    const flagged = evaluateRule(
      testIndex,
      {
        scope: "region:eu",
        match: "all",
        conditions: [
          { metric: "forecastAttainmentPct", operator: "lt", threshold: 95 },
          { metric: "growthPct", operator: "lt", threshold: 5 },
        ],
      },
      latest,
    );
    expect(flagged.map((m) => m.id).sort()).toEqual(["de", "it"]);
  });
});
