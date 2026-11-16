import type { Kpis } from "./kpis";

export type MetricKey = "revenue" | "growthPct" | "forecastAttainmentPct" | "sharePct" | "momentumPct";
export type MetricFormat = "currency" | "percent" | "signedPercent";

export interface MetricDef {
  key: MetricKey;
  label: string;
  short: string;
  format: MetricFormat;
  midpoint: number | null;
  description: string;
}

export const METRICS: Record<MetricKey, MetricDef> = {
  revenue: {
    key: "revenue",
    label: "Revenue",
    short: "Rev",
    format: "currency",
    midpoint: null,
    description: "Actual revenue in the selected period",
  },
  growthPct: {
    key: "growthPct",
    label: "YoY growth",
    short: "Growth",
    format: "signedPercent",
    midpoint: 0,
    description: "Revenue vs the same month a year earlier",
  },
  forecastAttainmentPct: {
    key: "forecastAttainmentPct",
    label: "Forecast attainment",
    short: "Attain.",
    format: "percent",
    midpoint: 100,
    description: "Actual ÷ forecast",
  },
  sharePct: {
    key: "sharePct",
    label: "Market share",
    short: "Share",
    format: "percent",
    midpoint: null,
    description: "Synthetic share, latest snapshot",
  },
  momentumPct: {
    key: "momentumPct",
    label: "3-mo momentum",
    short: "Momentum",
    format: "signedPercent",
    midpoint: 0,
    description: "Last 3 months vs the previous 3",
  },
};

export const MAP_METRICS = [
  "growthPct",
  "forecastAttainmentPct",
  "sharePct",
  "revenue",
] as const satisfies readonly MetricKey[];
export type MapMetricKey = (typeof MAP_METRICS)[number];

export function metricValue(kpis: Kpis, key: MetricKey): number | null {
  return kpis[key];
}
