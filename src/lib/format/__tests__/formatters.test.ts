import { describe, expect, it } from "vitest";
import { createFormatters } from "../formatters";

const norm = (s: string) => s.replace(/\s/g, " ");

describe("createFormatters", () => {
  const en = createFormatters("en-US", "USD");
  const de = createFormatters("de-DE", "USD");

  it("formats compact currency per locale", () => {
    expect(en.compactCurrency(1_234_567)).toBe("$1.2M");
    expect(norm(de.compactCurrency(1_234_567))).toBe("1,2 Mio. $");
  });

  it("formats YYYY-MM periods without time zone drift", () => {
    expect(en.period("2026-03")).toBe("Mar 2026");
    expect(de.periodLong("2026-03")).toBe("März 2026");
  });
});
