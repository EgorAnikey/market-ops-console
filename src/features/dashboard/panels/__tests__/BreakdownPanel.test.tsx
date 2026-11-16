import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import { BreakdownPanel } from "../BreakdownPanel";

describe("BreakdownPanel", () => {
  it("names the rows it actually shows when a product filter is on", () => {
    renderWithProviders(<BreakdownPanel />, { searchParams: "?product=veltrix" });
    expect(screen.getByRole("heading", { name: "Breakdown by region" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /^Region/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Europe" })).toBeInTheDocument();
  });

  it("labels share as the latest snapshot when an older month is shown", () => {
    renderWithProviders(<BreakdownPanel />, { searchParams: "?region=eu&period=2025-06" });
    expect(screen.getByRole("columnheader", { name: /^Share, May 2026/ })).toBeInTheDocument();
  });
});
