import { METRICS, type MetricKey } from "@/domain/metrics";
import type { Kpis } from "@/domain/kpis";
import type { Scope } from "@/domain/scope";

export const RADAR_AXES: readonly MetricKey[] = [
  "revenue",
  "growthPct",
  "forecastAttainmentPct",
  "sharePct",
  "momentumPct",
];

export interface RadarEntity {
  key: string;
  name: string;
  scope: Scope;
  kpis: Kpis;
}

export interface RadarAxisScale {
  key: MetricKey;
  label: string;
  min: number;
  max: number;
}

export function radarScales(entities: readonly RadarEntity[]): RadarAxisScale[] {
  return RADAR_AXES.map((key) => {
    const values = entities.map((e) => e.kpis[key]).filter((v): v is number => v !== null);
    const lo = key === "revenue" ? 0 : Math.min(...values);
    const hi = Math.max(...values);
    const pad = (hi - lo || Math.abs(hi) || 1) * 0.15;
    return { key, label: METRICS[key].label, min: key === "revenue" ? 0 : lo - pad, max: hi + pad };
  });
}

export function radarRadius(value: number | null, axis: RadarAxisScale): number | null {
  if (value === null || !Number.isFinite(value)) return null;
  return Math.min(1, Math.max(0, (value - axis.min) / (axis.max - axis.min || 1)));
}
