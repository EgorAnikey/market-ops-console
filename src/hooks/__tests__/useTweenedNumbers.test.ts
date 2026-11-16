import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_MS } from "@/lib/motion";
import { useTweenedNumbers } from "../useTweenedNumbers";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const setup = () =>
  renderHook(({ values, revision }) => useTweenedNumbers(values, revision), {
    initialProps: { values: [0, 100] as readonly number[], revision: 0 },
  });

describe("useTweenedNumbers", () => {
  it("moves smoothly from the old values to the new ones when a tick brings them", () => {
    const { result, rerender } = setup();
    rerender({ values: [100, 0], revision: 1 });
    expect(result.current).toEqual([0, 100]);

    act(() => vi.advanceTimersByTime(MOTION_MS / 2));
    const [a = 0, b = 0] = result.current;
    expect(a).toBeGreaterThan(0);
    expect(a).toBeLessThan(100);
    expect(b).toBeGreaterThan(0);
    expect(b).toBeLessThan(100);

    act(() => vi.advanceTimersByTime(MOTION_MS));
    expect(result.current).toEqual([100, 0]);
  });

  it("jumps instead of easing for navigation, a new shape, or reduced motion", () => {
    const navigated = setup();
    navigated.rerender({ values: [5, 5], revision: 0 });
    expect(navigated.result.current).toEqual([5, 5]);

    const reshaped = setup();
    reshaped.rerender({ values: [1, 2, 3], revision: 1 });
    expect(reshaped.result.current).toEqual([1, 2, 3]);

    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const reduced = setup();
    reduced.rerender({ values: [7, 7], revision: 1 });
    expect(reduced.result.current).toEqual([7, 7]);
  });

  it("treats missing values as equal, so a chart with gaps doesn't re-render forever", () => {
    const { result, rerender } = renderHook(({ values }) => useTweenedNumbers(values, 0), {
      initialProps: { values: [Number.NaN, 1] as readonly number[] },
    });
    rerender({ values: [Number.NaN, 1] });
    expect(result.current).toEqual([Number.NaN, 1]);
  });
});
