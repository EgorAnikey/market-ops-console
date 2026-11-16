"use client";

import { useMemo } from "react";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import type { PeriodPoint } from "@/domain/aggregate";
import { SERIES } from "./time-series-meta";

export const TS_M = { top: 14, right: 12, bottom: 22, left: 56 };

export function useTimeSeriesScales(points: readonly PeriodPoint[], width: number, height: number) {
  return useMemo(() => {
    const [lo = 0, hi = 1] = extent(points.flatMap((p) => [p.actual, p.forecast, p.priorYear]));
    const y = scaleLinear()
      .domain([lo * 0.92, hi * 1.04])
      .nice()
      .range([height - TS_M.bottom, TS_M.top]);
    const x = scaleLinear()
      .domain([0, Math.max(1, points.length - 1)])
      .range([TS_M.left, width - TS_M.right]);
    const paths = SERIES.map((s) => ({
      ...s,
      d:
        line<PeriodPoint>()
          .x((_, i) => x(i))
          .y((p) => y(p[s.key]))([...points]) ?? "",
    }));
    return { x, y, paths };
  }, [points, width, height]);
}
