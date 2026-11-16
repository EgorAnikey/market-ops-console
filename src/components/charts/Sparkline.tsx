"use client";

import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { useTweenedNumbers } from "@/hooks/useTweenedNumbers";

const W = 96;
const H = 28;

export function Sparkline({
  values: target,
  highlightIndex,
  revision = 0,
}: {
  values: readonly number[];
  highlightIndex?: number;
  revision?: number;
}) {
  const values = useTweenedNumbers(target, revision);
  if (values.length < 2) return null;
  const [lo = 0, hi = 1] = extent(values);
  const x = scaleLinear()
    .domain([0, values.length - 1])
    .range([2, W - 2]);
  const y = scaleLinear()
    .domain([lo, hi === lo ? lo + 1 : hi])
    .range([H - 3, 3]);
  const d =
    line<number>()
      .x((_, i) => x(i))
      .y((v) => y(v))([...values]) ?? "";
  const hi_ = highlightIndex ?? values.length - 1;
  return (
    <svg aria-hidden width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="shrink-0">
      <path d={d} fill="none" stroke="var(--chart-actual)" strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={x(hi_)} cy={y(values[hi_] ?? 0)} r={2.5} fill="var(--chart-actual)" />
    </svg>
  );
}
