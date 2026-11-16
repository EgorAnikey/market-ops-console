import { describe, expect, it } from "vitest";
import { testIndex } from "@/test/dataset";
import { resolveCitations } from "../citations";

describe("resolveCitations", () => {
  it("resolves market, product and period ids to authoritative values", () => {
    const [c] = resolveCitations(testIndex, [
      { marketId: "de", productId: "veltrix", period: "2026-03", label: "Veltrix in Germany" },
    ]);
    expect(c).toMatchObject({ n: 1, verified: true, period: "2026-03", mentions: ["Germany", "Veltrix"] });
    expect(c?.scope).toEqual({ regionId: "eu", marketId: "de", productId: "veltrix" });
    expect(c?.kpis?.revenue).toBeGreaterThan(0);
  });

  it("marks citations to ids that do not exist as unverified", () => {
    const [c] = resolveCitations(testIndex, [{ marketId: "atlantis", period: "2031-01" }]);
    expect(c?.verified).toBe(false);
    expect(c?.kpis).toBeNull();
    expect(c?.unresolved).toHaveLength(2);
  });
});
