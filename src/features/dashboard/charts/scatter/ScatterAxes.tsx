import type { ScaleLinear } from "d3-scale";
import type { Formatters } from "@/lib/format/formatters";
import { tickCount } from "@/lib/viz/layout";
import { SC_M as M } from "./useScatterScales";

interface ScatterAxesProps {
  x: ScaleLinear<number, number>;
  width: number;
  height: number;
  shareLabel: string;
  fmt: Formatters;
}

export function ScatterAxes({ x, width: W, height: H, shareLabel, fmt }: ScatterAxesProps) {
  return (
    <g aria-hidden className="text-[10px]" fill="var(--fg-subtle)">
      {x.ticks(tickCount(W - M.left - M.right)).map((t) => (
        <text key={t} x={x(t)} y={H - M.bottom + 14} textAnchor="middle">
          {fmt.signedPercent(t)}
        </text>
      ))}
      <line
        x1={x(0)}
        x2={x(0)}
        y1={M.top}
        y2={H - M.bottom}
        stroke="var(--border-strong)"
        strokeDasharray="3 3"
      />
      <text x={W - M.right} y={H - 4} textAnchor="end">
        YoY growth →
      </text>
      <text x={4} y={M.top - 4}>
        ↑ {shareLabel}
      </text>
    </g>
  );
}
