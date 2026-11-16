import { describe, expect, it } from "vitest";
import { resolveCitations } from "@/domain/citations";
import { testIndex } from "@/test/dataset";
import { annotate } from "../annotate";

describe("annotate", () => {
  const citations = resolveCitations(testIndex, [
    { marketId: "de", period: "2026-05" },
    { marketId: "de", period: "2026-03" },
    { regionId: "apac" },
  ]);

  it("links every mention of a cited entity to all of its citations", () => {
    const segments = annotate("Germany fell while APAC grew; germany steadied.", citations);
    expect(segments.filter((s) => s.type === "ref")).toEqual([
      { type: "ref", text: "Germany", refs: [1, 2] },
      { type: "ref", text: "APAC", refs: [3] },
      { type: "ref", text: "germany", refs: [1, 2] },
    ]);
    expect(segments.map((s) => s.text).join("")).toBe("Germany fell while APAC grew; germany steadied.");
  });

  it("does not match inside other words and returns plain text without citations", () => {
    expect(annotate("Germanyx", citations)).toEqual([{ type: "text", text: "Germanyx" }]);
    expect(annotate("plain", [])).toEqual([{ type: "text", text: "plain" }]);
  });
});
