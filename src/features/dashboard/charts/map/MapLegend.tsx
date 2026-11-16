import { METRICS, type MetricKey } from "@/domain/metrics";
import type { Formatters } from "@/lib/format/formatters";
import type { MetricColorScale } from "./map-scale";

export function MapLegend({
  scale,
  metric,
  fmt,
}: {
  scale: MetricColorScale;
  metric: MetricKey;
  fmt: Formatters;
}) {
  const [lo, mid, hi] = scale.stops;
  const def = METRICS[metric];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.6875rem] text-fg-muted">
      <div className="flex items-center gap-1.5">
        <span className="num">{fmt.metric(def, lo)}</span>
        <span
          aria-hidden
          className="h-2 w-28 rounded-sm"
          style={{
            background: `linear-gradient(90deg, ${scale.fill(lo)}, ${scale.fill(mid)}, ${scale.fill(hi)})`,
          }}
        />
        <span className="num">{fmt.metric(def, hi)}</span>
        <span className="sr-only">
          {def.label} colour scale from {fmt.metric(def, lo)} to {fmt.metric(def, hi)}
          {scale.diverging ? `, neutral at ${fmt.metric(def, mid)}` : ""}
        </span>
      </div>
      <span className="flex items-center gap-1.5">
        <svg aria-hidden width="14" height="10">
          <rect width="14" height="10" fill="var(--surface-3)" />
          <path d="M0,10 L10,0 M4,10 L14,0" stroke="var(--fg)" strokeOpacity="0.45" />
        </svg>
        Hatched: at risk or off track
      </span>
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="size-2.5 rounded-sm bg-[var(--no-data)]" /> Not in portfolio
      </span>
    </div>
  );
}
