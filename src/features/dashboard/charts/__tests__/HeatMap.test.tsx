import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { growthMatrix } from "@/domain/matrix";
import { regionScope } from "@/domain/hierarchy";
import { createFormatters } from "@/lib/format/formatters";
import { testIndex } from "@/test/dataset";
import { renderWithProviders } from "@/test/render";
import { HeatMap } from "../HeatMap";

describe("HeatMap", () => {
  const rows = growthMatrix(testIndex, regionScope("eu"));
  const fmt = createFormatters("en-US", "USD");

  it("is a single tab stop navigable with arrow keys, and Enter selects a cell", async () => {
    const onSelect = vi.fn();
    renderWithProviders(
      <HeatMap
        rows={rows}
        periods={testIndex.periods}
        selectedPeriod="2026-02"
        selectedMarketId={null}
        fmt={fmt}
        onSelect={onSelect}
      />,
    );
    const grid = screen.getByRole("grid");
    expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1);

    await userEvent.tab();
    expect(document.activeElement).toHaveAccessibleName(/^Germany, Feb 2026: growth/);
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveAccessibleName(
      /^Germany, Mar 2026: growth -\d+\.\d%\. Anomaly: Revenue fell 27%/,
    );
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith("gb", "2026-03");
  });
});
