export const MOTION_MS = 700;

export const easeOut = (t: number): number => 1 - (1 - t) ** 3;

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
