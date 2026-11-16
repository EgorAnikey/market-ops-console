import { describe, expect, it } from "vitest";
import { safeReturnTo } from "../safe-redirect";

describe("safeReturnTo", () => {
  it("keeps a path on this site, query included", () => {
    expect(safeReturnTo("/?region=eu&market=de")).toBe("/?region=eu&market=de");
  });

  it("refuses anything that could leave the site", () => {
    for (const value of [
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "javascript:alert(1)",
      "",
      null,
      ["/"],
    ]) {
      expect(safeReturnTo(value)).toBe("/");
    }
  });
});
