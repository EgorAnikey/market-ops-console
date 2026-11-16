import { describe, expect, it } from "vitest";
import { testIndex } from "@/test/dataset";
import { childEntities, childKind, marketScope, sanitizeScope } from "../hierarchy";
import { PORTFOLIO_SCOPE } from "../scope";

describe("hierarchy", () => {
  it("drills portfolio → regions → markets → products, and a product filter keeps the same children", () => {
    expect(childEntities(testIndex, PORTFOLIO_SCOPE).map((e) => e.kind)).toEqual(Array(4).fill("region"));
    const eu = childEntities(testIndex, PORTFOLIO_SCOPE).find((e) => e.id === "eu")!;
    expect(childEntities(testIndex, eu.scope).map((e) => e.id)).toContain("de");
    expect(childEntities(testIndex, marketScope(testIndex, "de"))).toHaveLength(5);

    expect(childKind({ regionId: null, marketId: null, productId: "veltrix" })).toBe("region");
    expect(childKind({ regionId: "eu", marketId: null, productId: "veltrix" })).toBe("market");
    expect(childEntities(testIndex, { ...PORTFOLIO_SCOPE, productId: "veltrix" })[0]?.scope.productId).toBe(
      "veltrix",
    );
  });

  it("repairs inconsistent or unknown ids from a shared URL", () => {
    expect(sanitizeScope(testIndex, { regionId: "apac", marketId: "de", productId: "nope" })).toEqual({
      regionId: "eu",
      marketId: "de",
      productId: null,
    });
    expect(sanitizeScope(testIndex, { regionId: "mars", marketId: null, productId: null })).toEqual(
      PORTFOLIO_SCOPE,
    );
  });
});
