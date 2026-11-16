import type { ScaleLinear } from "d3-scale";

interface YGridProps {
  scale: ScaleLinear<number, number>;
  x1: number;
  x2: number;
  ticks?: number;
  format: (v: number) => string;
}

export function YGrid({ scale, x1, x2, ticks = 4, format }: YGridProps) {
  return (
    <g aria-hidden className="text-[10px]">
      {scale.ticks(ticks).map((t) => (
        <g key={t} transform={`translate(0,${scale(t)})`}>
          <line x1={x1} x2={x2} stroke="var(--chart-grid)" />
          <text x={x1 - 6} dy="0.32em" textAnchor="end" fill="var(--fg-subtle)">
            {format(t)}
          </text>
        </g>
      ))}
    </g>
  );
}

interface XLabelsProps<T> {
  items: readonly T[];
  x: (item: T, i: number) => number;
  y: number;
  label: (item: T) => string;
  every?: number;
}

export function XLabels<T>({ items, x, y, label, every = 1 }: XLabelsProps<T>) {
  return (
    <g aria-hidden className="text-[10px]">
      {items.map((item, i) =>
        (i % every === 0 && items.length - 1 - i >= every) || i === items.length - 1 ? (
          <text
            key={i}
            x={x(item, i)}
            y={y}
            textAnchor={i === 0 ? "start" : i === items.length - 1 ? "end" : "middle"}
            fill="var(--fg-subtle)"
          >
            {label(item)}
          </text>
        ) : null,
      )}
    </g>
  );
}
