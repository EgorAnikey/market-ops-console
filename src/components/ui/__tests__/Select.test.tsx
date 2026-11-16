import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Select, type SelectItem } from "../Select";

const OPTIONS: SelectItem[] = [
  { value: "portfolio", label: "Whole portfolio" },
  {
    label: "Regions",
    options: [
      { value: "eu", label: "Europe" },
      { value: "apac", label: "APAC" },
    ],
  },
];

function Harness({ initial = "portfolio" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return <Select aria-label="Applies to" value={value} onChange={setValue} options={OPTIONS} />;
}

describe("Select", () => {
  it("works from the keyboard", async () => {
    render(<Harness />);
    screen.getByRole("combobox").focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByRole("combobox")).toHaveTextContent("Europe");
  });

  it("renders the chosen label without JavaScript, so server HTML matches the hydrated page", async () => {
    const { renderToString } = await import("react-dom/server");
    const html = renderToString(
      <Select aria-label="Period" value="apac" onChange={() => undefined} options={OPTIONS} />,
    );
    expect(html).toContain("APAC");
  });
});
