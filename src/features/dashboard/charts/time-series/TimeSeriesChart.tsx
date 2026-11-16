"use client";

import { useMemo } from "react";
import type { Period } from "@/contracts/dataset";
import type { PeriodPoint } from "@/domain/aggregate";
import { XLabels, YGrid } from "@/components/charts/Axes";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { usePeriodScrubber } from "@/hooks/usePeriodScrubber";
import { useTweenedNumbers } from "@/hooks/useTweenedNumbers";
import { useViewBoxPointer } from "@/hooks/useViewBoxPointer";
import type { Formatters } from "@/lib/format/formatters";
import { SERIES, seriesSummary } from "./time-series-meta";
import { TimeSeriesTooltip } from "./TimeSeriesTooltip";
import { useElementWidth } from "@/hooks/useElementWidth";
import { CHART_SVG_CLASS, chartHeight, chartHeightVars, labelEvery } from "@/lib/viz/layout";
import { TS_M as M, useTimeSeriesScales } from "./useTimeSeriesScales";

const HEIGHT = { compact: 200, regular: 240 };

export interface SeriesAnomaly {
  period: Period;
  note: string;
}

interface TimeSeriesChartProps {
  points: readonly PeriodPoint[];
  selected: Period;
  onSelect: (period: Period) => void;
  anomalies: readonly SeriesAnomaly[];
  fmt: Formatters;
  entityLabel: string;
  revision?: number;
}

export function TimeSeriesChart({
  points,
  selected,
  onSelect,
  anomalies,
  fmt,
  entityLabel,
  revision = 0,
}: TimeSeriesChartProps) {
  const { ref: boxRef, width: W } = useElementWidth<HTMLDivElement>(640);
  const H = chartHeight(W, HEIGHT.compact, HEIGHT.regular);
  const { ref, toViewBox } = useViewBoxPointer(W, H);
  const drawn = useTweenedPoints(points, revision);
  const { x, y, paths } = useTimeSeriesScales(drawn, W, H);
  const selectedIndex = Math.max(
    0,
    points.findIndex((p) => p.period === selected),
  );
  const { hover, handlers } = usePeriodScrubber({
    items: points,
    selectedIndex,
    onSelect: (p) => onSelect(p.period),
    indexAt: (e) => {
      const pos = toViewBox(e);
      return pos ? Math.max(0, Math.min(points.length - 1, Math.round(x.invert(pos.x)))) : null;
    },
  });
  const active = points[hover ?? selectedIndex];
  const guide = (i: number, stroke: string) => (
    <line x1={x(i)} x2={x(i)} y1={M.top} y2={H - M.bottom} stroke={stroke} />
  );

  return (
    <div ref={boxRef} className="relative @container">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={chartHeightVars(HEIGHT.compact, HEIGHT.regular)}
        className={`${CHART_SVG_CLASS} touch-none select-none`}
        role="slider"
        tabIndex={0}
        aria-label={`${entityLabel} revenue over time. Use arrow keys to change period.`}
        aria-valuemin={0}
        aria-valuemax={points.length - 1}
        aria-valuenow={selectedIndex}
        aria-valuetext={points[selectedIndex] ? seriesSummary(points[selectedIndex], fmt) : ""}
        {...handlers}
      >
        <YGrid scale={y} x1={M.left} x2={W - M.right} format={fmt.compactCurrency} />
        <XLabels
          items={points}
          x={(_, i) => x(i)}
          y={H - 6}
          every={labelEvery(points.length, W - M.left - M.right)}
          label={(p) => fmt.period(p.period)}
        />
        {guide(selectedIndex, "var(--border-strong)")}
        {hover !== null ? guide(hover, "var(--chart-grid)") : null}
        {paths.map((s) => (
          <path
            key={s.key}
            d={s.d}
            fill="none"
            stroke={s.color}
            strokeWidth={s.width}
            strokeDasharray={s.dash}
            strokeLinejoin="round"
          />
        ))}
        {anomalies.map((a) => {
          const i = points.findIndex((p) => p.period === a.period);
          return i < 0 ? null : (
            <path key={a.period} aria-hidden d={`M${x(i)},${M.top + 10} l5,-9 h-10 Z`} fill="var(--bad)" />
          );
        })}
        {SERIES.map((s) => (
          <circle
            key={s.key}
            cx={x(selectedIndex)}
            cy={y(drawn[selectedIndex]?.[s.key] ?? 0)}
            r={3.5}
            fill={s.color}
            stroke="var(--surface)"
            strokeWidth={1.5}
          />
        ))}
      </svg>
      <ChartTooltip anchor={hover !== null && active ? { x: x(hover) / W, y: 0.35 } : null}>
        {active ? (
          <TimeSeriesTooltip
            point={active}
            fmt={fmt}
            note={anomalies.find((a) => a.period === active.period)?.note}
          />
        ) : null}
      </ChartTooltip>
    </div>
  );
}

function useTweenedPoints(points: readonly PeriodPoint[], revision: number): readonly PeriodPoint[] {
  const flat = useMemo(() => points.flatMap((p) => [p.actual, p.forecast, p.priorYear]), [points]);
  const tweened = useTweenedNumbers(flat, revision);
  return useMemo(
    () =>
      points.map((p, i) => ({
        ...p,
        actual: tweened[i * 3] ?? p.actual,
        forecast: tweened[i * 3 + 1] ?? p.forecast,
        priorYear: tweened[i * 3 + 2] ?? p.priorYear,
      })),
    [points, tweened],
  );
}
