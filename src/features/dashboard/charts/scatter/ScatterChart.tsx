"use client";

import { useMemo, type ReactNode } from "react";
import type { MarketHealth } from "@/domain/health";
import { YGrid } from "@/components/charts/Axes";
import { inRect, useBrush } from "@/hooks/useBrush";
import { useTweenedNumbers } from "@/hooks/useTweenedNumbers";
import { useViewBoxPointer } from "@/hooks/useViewBoxPointer";
import type { Formatters } from "@/lib/format/formatters";
import { ScatterAxes } from "./ScatterAxes";
import { ScatterLabels } from "./ScatterLabels";
import { ScatterPoint } from "./ScatterPoint";
import { useElementWidth } from "@/hooks/useElementWidth";
import { CHART_SVG_CLASS, chartHeight, chartHeightVars } from "@/lib/viz/layout";
import { SC_M as M, useScatterScales } from "./useScatterScales";

const HEIGHT = { compact: 260, regular: 300 };

export type ScatterSelection =
  | { kind: "focus"; ids: readonly string[]; onChange: (ids: string[]) => void }
  | { kind: "current"; id: string; onOpen: (id: string) => void };

interface ScatterChartProps {
  health: readonly MarketHealth[];
  selection: ScatterSelection;
  fmt: Formatters;
  revision?: number;
  shareLabel?: string;
  empty?: ReactNode;
}

const LABELS = {
  focus: "Growth versus market share. Drag to select markets, or focus a market and press Space.",
  current: "Growth versus market share among regional peers. Focus a market and press Enter to open it.",
};

export function ScatterChart(props: ScatterChartProps) {
  const { health, selection, fmt, revision = 0, shareLabel = "Share", empty = null } = props;
  const { ref: boxRef, width: W } = useElementWidth<HTMLDivElement>(560);
  const H = chartHeight(W, HEIGHT.compact, HEIGHT.regular);
  const { ref, toViewBox } = useViewBoxPointer(W, H);
  const points = useMemo(
    () => health.filter((h) => h.kpis.growthPct !== null && h.kpis.sharePct !== null),
    [health],
  );
  const { x, y, r } = useScatterScales(points, W, H);
  const flat = useMemo(
    () => points.flatMap((h) => [h.kpis.growthPct ?? 0, h.kpis.sharePct ?? 0, h.kpis.revenue]),
    [points],
  );
  const drawn = useTweenedNumbers(flat, revision);
  const pos = (i: number) => ({ cx: x(drawn[i * 3] ?? 0), cy: y(drawn[i * 3 + 1] ?? 0) });

  const focus = selection.kind === "focus" ? selection.ids : [selection.id];
  const { rect, handlers } = useBrush(toViewBox, (box) => {
    if (selection.kind !== "focus") return;
    selection.onChange(
      box ? points.filter((_, i) => inRect(box, pos(i).cx, pos(i).cy)).map((h) => h.market.id) : [],
    );
  });
  const marks = points.map((h, i) => ({
    id: h.market.id,
    health: h,
    ...pos(i),
    r: r(drawn[i * 3 + 2] ?? h.kpis.revenue),
    selected: focus.includes(h.market.id),
    dimmed: focus.length > 0 && !focus.includes(h.market.id),
  }));
  const activate = (id: string) => {
    if (selection.kind === "current") return selection.onOpen(id);
    selection.onChange(focus.includes(id) ? focus.filter((f) => f !== id) : [...focus, id]);
  };

  if (points.length === 0 && empty) {
    return (
      <div ref={boxRef} className="@container">
        <div
          style={chartHeightVars(HEIGHT.compact, HEIGHT.regular)}
          className="flex h-(--chart-h) items-center justify-center @min-[480px]:h-(--chart-h-regular)"
        >
          {empty}
        </div>
      </div>
    );
  }

  return (
    <div ref={boxRef} className="@container">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        style={chartHeightVars(HEIGHT.compact, HEIGHT.regular)}
        className={`${CHART_SVG_CLASS} touch-none select-none`}
        role="group"
        aria-label={LABELS[selection.kind]}
      >
        <YGrid scale={y} x1={M.left} x2={W - M.right} format={(v) => fmt.percent(v)} />
        <ScatterAxes x={x} width={W} height={H} shareLabel={shareLabel} fmt={fmt} />
        <rect
          x={M.left}
          y={M.top}
          width={W - M.left - M.right}
          height={H - M.top - M.bottom}
          fill="transparent"
          className={selection.kind === "focus" ? "cursor-crosshair" : undefined}
          {...(selection.kind === "focus" ? handlers : {})}
        />
        {marks.map((m) => (
          <ScatterPoint key={m.id} {...m} mode={selection.kind} fmt={fmt} onActivate={activate} />
        ))}
        <ScatterLabels
          labels={marks.map((m) => ({
            id: m.id,
            text: m.health.market.iso2,
            x: m.cx + m.r * 1.25 + 3,
            y: m.cy,
            dimmed: m.dimmed,
          }))}
        />
        {rect ? (
          <rect
            x={Math.min(rect.x0, rect.x1)}
            y={Math.min(rect.y0, rect.y1)}
            width={Math.abs(rect.x1 - rect.x0)}
            height={Math.abs(rect.y1 - rect.y0)}
            fill="var(--accent)"
            fillOpacity={0.08}
            stroke="var(--accent)"
            strokeDasharray="4 3"
            pointerEvents="none"
          />
        ) : null}
      </svg>
    </div>
  );
}
