import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useGridNavigation } from "../useGridNavigation";

function Grid({ rows, cols }: { rows: number; cols: number }) {
  const { onKeyDown, cellProps } = useGridNavigation(rows, cols, { row: 0, col: 0 });
  return (
    <table role="grid" onKeyDown={onKeyDown}>
      <tbody>
        {Array.from({ length: rows }, (_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }, (_, c) => (
              <td key={c} role="gridcell" aria-label={`${r}:${c}`} {...cellProps(r, c)} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const tabStops = () => screen.getByRole("grid").querySelectorAll('[tabindex="0"]');

describe("useGridNavigation", () => {
  it("keeps the grid reachable when it shrinks under the active cell", async () => {
    const { rerender } = render(<Grid rows={5} cols={3} />);
    await userEvent.tab();
    await userEvent.keyboard("{Control>}{End}{/Control}");
    expect(document.activeElement).toHaveAccessibleName("4:2");

    rerender(<Grid rows={2} cols={3} />);
    expect(tabStops()).toHaveLength(1);
    expect(tabStops()[0]).toHaveAccessibleName("1:2");
  });
});
