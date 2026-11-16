import type { ReactNode } from "react";

export type SwatchKind = "line" | "dashed" | "dotted" | "square" | "dot" | "triangle" | "diamond";

const SHAPES: Partial<Record<SwatchKind, string>> = {
  dot: "M1,5 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0",
  triangle: "M5,0.5 L9.5,9 L0.5,9 Z",
  diamond: "M5,0 L10,5 L5,10 L0,5 Z",
};

export interface LegendItem {
  label: string;
  color: string;
  kind: SwatchKind;
}

function Swatch({ color, kind }: Omit<LegendItem, "label">) {
  if (kind === "square")
    return <span aria-hidden className="size-2.5 rounded-sm" style={{ background: color }} />;
  const shape = SHAPES[kind];
  if (shape) {
    return (
      <svg aria-hidden width="10" height="10" viewBox="0 0 10 10">
        <path d={shape} fill={color} />
      </svg>
    );
  }
  const dash = kind === "dashed" ? "5 3" : kind === "dotted" ? "1.5 2.5" : undefined;
  return (
    <svg aria-hidden width="18" height="6">
      <line
        x1="0"
        x2="18"
        y1="3"
        y2="3"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={dash}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Legend({ items, children }: { items: readonly LegendItem[]; children?: ReactNode }) {
  return (
    <ul
      className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-fg-muted"
      aria-label="Legend"
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <Swatch color={item.color} kind={item.kind} />
          {item.label}
        </li>
      ))}
      {children}
    </ul>
  );
}
