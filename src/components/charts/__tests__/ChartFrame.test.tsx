import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartFrame } from "../ChartFrame";

function Boom(): never {
  throw new Error("chart exploded");
}

describe("ChartFrame", () => {
  it("contains a rendering failure to its own panel", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ChartFrame title="Map" table={null}>
        <Boom />
      </ChartFrame>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Map failed to render");
  });
});
