import type { PointerEvent } from "react";
import { onActivate } from "@/lib/a11y";

interface MarketShapeProps {
  d: string;
  fill: string;
  label: string;
  selected: boolean;
  dimmed: boolean;
  hatched: boolean;
  onSelect: () => void;
  onHover: (pos: { x: number; y: number } | null) => void;
}

export function MarketShape({
  d,
  fill,
  label,
  selected,
  dimmed,
  hatched,
  onSelect,
  onHover,
}: MarketShapeProps) {
  const onPointerMove = (e: PointerEvent<SVGPathElement>) => {
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (box) onHover({ x: (e.clientX - box.left) / box.width, y: (e.clientY - box.top) / box.height });
  };

  return (
    <g opacity={dimmed ? 0.35 : 1}>
      <path
        d={d}
        role="button"
        tabIndex={0}
        aria-label={label}
        aria-current={selected ? "true" : undefined}
        fill={fill}
        stroke={selected ? "var(--fg)" : "var(--border-strong)"}
        strokeWidth={selected ? 1.8 : 0.6}
        className="viz-focus cursor-pointer"
        onClick={onSelect}
        onKeyDown={onActivate(onSelect)}
        onPointerMove={onPointerMove}
        onPointerLeave={() => onHover(null)}
      />
      {hatched ? <path d={d} fill="url(#hatch-attention)" pointerEvents="none" aria-hidden /> : null}
    </g>
  );
}
