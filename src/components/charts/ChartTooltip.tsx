import type { ReactNode } from "react";

export interface TooltipAnchor {
  x: number;
  y: number;
}

export function ChartTooltip({ anchor, children }: { anchor: TooltipAnchor | null; children: ReactNode }) {
  if (!anchor) return null;
  const flip = anchor.x > 0.6;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10 min-w-36 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs shadow-pop"
      style={{
        left: `${anchor.x * 100}%`,
        top: `${anchor.y * 100}%`,
        transform: `translate(${flip ? "calc(-100% - 10px)" : "10px"}, -50%)`,
      }}
    >
      {children}
    </div>
  );
}
