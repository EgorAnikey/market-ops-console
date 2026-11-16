import { METRICS, type MetricKey } from "@/domain/metrics";
import { divergingFill, sequentialFill } from "@/lib/viz/color";

export interface MetricColorScale {
  fill: (value: number | null) => string;
  stops: [number, number, number];
  diverging: boolean;
}

export function metricColorScale(metric: MetricKey, values: readonly (number | null)[]): MetricColorScale {
  const nums = values.filter((v): v is number => v !== null);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const mid = METRICS[metric].midpoint;
  if (mid !== null) {
    const half = Math.max(Math.abs(max - mid), Math.abs(mid - min), 1);
    return {
      fill: (v) => divergingFill(v, mid, half),
      stops: [mid - half, mid, mid + half],
      diverging: true,
    };
  }
  return { fill: (v) => sequentialFill(v, min, max), stops: [min, (min + max) / 2, max], diverging: false };
}
