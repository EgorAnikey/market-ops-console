import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { AlertsPanel } from "../AlertsPanel";

beforeEach(() =>
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json([])),
  ),
);
afterEach(() => vi.unstubAllGlobals());

describe("Threshold alerts", () => {
  it("previews which markets the rule would flag as the rule changes", async () => {
    renderWithProviders(<AlertsPanel />);
    await screen.findByLabelText("Rule name");
    expect(screen.getByRole("status")).toHaveTextContent(
      "would flag 4 markets: Germany, United Kingdom, Italy, Spain",
    );
    await userEvent.click(screen.getByRole("radio", { name: "All conditions" }));
    expect(screen.getByRole("status")).toHaveTextContent(/would flag 1 market: Germany/);
  });
});
