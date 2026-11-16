import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { testDataset } from "@/test/dataset";
import { renderWithProviders } from "@/test/render";
import { FocusChip } from "../../components/FocusChip";
import { ScatterPanel } from "../ScatterPanel";

const europe = testDataset.markets.filter((m) => m.regionId === "eu");

describe("ScatterPanel", () => {
  it("in a market, shows its regional peers with the market marked, opens the one you pick, and links back to multi-select", async () => {
    const { onUrlUpdate } = renderWithProviders(<ScatterPanel />, { searchParams: "?region=eu&market=de" });
    expect(screen.getAllByRole("button", { name: /growth/ })).toHaveLength(europe.length);
    expect(screen.getByRole("button", { name: /^Germany:/ })).toHaveAttribute("aria-current", "true");
    expect(screen.queryByRole("checkbox")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: /^France:/ }));
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].searchParams.get("market")).toBe("fr");

    await userEvent.click(screen.getByRole("button", { name: "select several in Europe" }));
    const params = onUrlUpdate.mock.calls.at(-1)?.[0].searchParams;
    expect(params?.get("region")).toBe("eu");
    expect(params?.get("market")).toBeNull();
  });

  it("ignores a focus left in the URL once a market is open, so nothing claims a selection the chart can't show", () => {
    renderWithProviders(
      <>
        <FocusChip />
        <ScatterPanel />
      </>,
      { searchParams: "?region=eu&market=de&focus=de,fr" },
    );
    expect(screen.queryByText(/^Focused:/)).toBeNull();
    expect(screen.getByRole("button", { name: /^Germany:/ })).toHaveAttribute("aria-current", "true");
  });

  it("with a product filter, explains that share isn't tracked per product and offers a way out", async () => {
    const { onUrlUpdate } = renderWithProviders(<ScatterPanel />, {
      searchParams: "?region=eu&product=veltrix",
    });
    expect(screen.getByText("Market share isn't tracked per product")).toBeInTheDocument();
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);

    await userEvent.click(screen.getByRole("button", { name: "Show all products" }));
    const params = onUrlUpdate.mock.calls.at(-1)?.[0].searchParams;
    expect(params?.get("product")).toBeNull();
    expect(params?.get("region")).toBe("eu");
  });
});
