"use client";

import { useMemo, useState } from "react";
import { METRICS } from "@/domain/metrics";
import { useTweenedNumbers } from "@/hooks/useTweenedNumbers";
import type { Formatters } from "@/lib/format/formatters";
import { seriesColor } from "@/lib/viz/color";
import { radarRadius, radarScales, type RadarEntity } from "./radar-model";

const SIZE = 320;
const C = SIZE / 2;
const R = SIZE / 2 - 48;
const RINGS = [0.25, 0.5, 0.75, 1];

interface RadarChartProps {
  entities: readonly RadarEntity[];
  fmt: Formatters;
  revision?: number;
}

const polar = (axis: number, total: number, r: number) => {
  const angle = (Math.PI * 2 * axis) / total - Math.PI / 2;
  return [C + Math.cos(angle) * r * R, C + Math.sin(angle) * r * R] as const;
};

export function RadarChart({ entities, fmt, revision = 0 }: RadarChartProps) {
  const [active, setActive] = useState<string | null>(null);
  const axes = useMemo(() => radarScales(entities), [entities]);
  const n = axes.length;

  const shapes = useMemo(
    () =>
      entities.map((e, i) => {
        const pts = axes.map((axis, a) => polar(a, n, radarRadius(e.kpis[axis.key], axis) ?? 0));
        const label = `${e.name}: ${axes.map((a) => `${a.label} ${fmt.metric(METRICS[a.key], e.kpis[a.key])}`).join(", ")}`;
        return { entity: e, color: seriesColor(i), points: pts, label };
      }),
    [entities, axes, n, fmt],
  );
  const flat = useMemo(() => shapes.flatMap((s) => s.points.flat()), [shapes]);
  const tweened = useTweenedNumbers(flat, revision);
  const vertex = (s: number, a: number) => {
    const i = (s * n + a) * 2;
    return [tweened[i] ?? C, tweened[i + 1] ?? C] as const;
  };

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto h-auto w-full max-w-[380px]"
      role="group"
      aria-label="Radar comparison"
    >
      <g aria-hidden>
        {RINGS.map((r) => (
          <polygon
            key={r}
            points={axes.map((_, a) => polar(a, n, r).join(",")).join(" ")}
            fill="none"
            stroke="var(--chart-grid)"
          />
        ))}
        {axes.map((axis, a) => {
          const [x, y] = polar(a, n, 1);
          const [lx, ly] = polar(a, n, 1.2);
          return (
            <g key={axis.key}>
              <line x1={C} y1={C} x2={x} y2={y} stroke="var(--chart-grid)" />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dy="0.32em"
                className="text-[10px]"
                fill="var(--fg-muted)"
              >
                {METRICS[axis.key].short}
              </text>
            </g>
          );
        })}
      </g>
      {shapes.map(({ entity, color, label }, s) => {
        const points = axes.map((_, a) => vertex(s, a));
        const dimmed = active !== null && active !== entity.key;
        return (
          <g
            key={entity.key}
            tabIndex={0}
            role="img"
            aria-label={label}
            className="viz-group-focus outline-none"
            onFocus={() => setActive(entity.key)}
            onBlur={() => setActive(null)}
            onPointerEnter={() => setActive(entity.key)}
            onPointerLeave={() => setActive(null)}
          >
            <polygon
              points={points.map((p) => p.join(",")).join(" ")}
              fill={color}
              fillOpacity={dimmed ? 0.03 : active ? 0.22 : 0.1}
              stroke={color}
              strokeOpacity={dimmed ? 0.25 : 1}
              strokeWidth={active === entity.key ? 2.5 : 1.5}
              className="transition-[fill-opacity,stroke-opacity]"
            />
            {points.map(([x, y], a) => (
              <circle key={a} cx={x} cy={y} r={2.5} fill={color} opacity={dimmed ? 0.25 : 1} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
