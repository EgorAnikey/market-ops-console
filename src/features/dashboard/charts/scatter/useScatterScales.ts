"use client";

import { useMemo } from "react";
import { extent, max } from "d3-array";
import { scaleLinear, scaleSqrt } from "d3-scale";
import type { MarketHealth } from "@/domain/health";

export const SC_M = { top: 14, right: 16, bottom: 32, left: 44 };

export function useScatterScales(points: readonly MarketHealth[], width: number, height: number) {
  return useMemo(() => {
    const [gx0 = -10, gx1 = 10] = extent(points, (h) => h.kpis.growthPct ?? 0);
    const [sy0 = 0, sy1 = 40] = extent(points, (h) => h.kpis.sharePct ?? 0);
    return {
      x: scaleLinear()
        .domain([Math.min(gx0, 0) - 3, gx1 + 3])
        .nice()
        .range([SC_M.left, width - SC_M.right]),
      y: scaleLinear()
        .domain([Math.max(0, sy0 - 4), sy1 + 4])
        .nice()
        .range([height - SC_M.bottom, SC_M.top]),
      r: scaleSqrt()
        .domain([0, max(points, (h) => h.kpis.revenue) ?? 1])
        .range([3, 16]),
    };
  }, [points, width, height]);
}
