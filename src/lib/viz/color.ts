import type { Status } from "@/contracts/dataset";
import { clamp } from "@/domain/math";

export function divergingFill(value: number | null, midpoint: number, halfRange: number): string {
  if (value === null) return "var(--no-data)";
  const t = clamp((value - midpoint) / halfRange, -1, 1);
  const end = t < 0 ? "var(--div-neg)" : "var(--div-pos)";
  return `color-mix(in oklab, ${end} ${Math.round(Math.abs(t) * 100)}%, var(--div-mid))`;
}

export function sequentialFill(value: number | null, min: number, max: number): string {
  if (value === null) return "var(--no-data)";
  const t = max === min ? 1 : clamp((value - min) / (max - min), 0, 1);
  return `color-mix(in oklab, var(--seq-hi) ${Math.round(15 + t * 85)}%, var(--seq-lo))`;
}

export const STATUS_COLOR: Record<Status, string> = {
  on_track: "var(--ok)",
  at_risk: "var(--warn)",
  off_track: "var(--bad)",
};

export const SERIES_COLORS = ["#2456d6", "#d9480f", "#0d8a6a", "#9c36b5", "#c09000"] as const;
export const seriesColor = (i: number): string => SERIES_COLORS[i % SERIES_COLORS.length]!;
