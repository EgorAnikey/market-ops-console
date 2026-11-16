import type { CSSProperties } from "react";

export const COMPACT_BREAKPOINT = 480;

export function chartHeight(width: number, compact: number, regular: number): number {
  return width < COMPACT_BREAKPOINT ? compact : regular;
}

export const CHART_SVG_CLASS = "block w-full h-(--chart-h) @min-[480px]:h-(--chart-h-regular)";

export function chartHeightVars(compact: number, regular: number): CSSProperties {
  return { "--chart-h": `${compact}px`, "--chart-h-regular": `${regular}px` } as CSSProperties;
}

export function labelEvery(count: number, plotWidth: number, minSpacing = 80): number {
  const fits = Math.max(1, Math.floor(plotWidth / minSpacing));
  return Math.max(1, Math.ceil(count / fits));
}

export const tickCount = (plotWidth: number, spacing = 90): number =>
  Math.max(3, Math.floor(plotWidth / spacing));
