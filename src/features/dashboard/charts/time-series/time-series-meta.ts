import type { LegendItem } from "@/components/charts/Legend";
import type { PeriodPoint } from "@/domain/aggregate";
import type { Formatters } from "@/lib/format/formatters";

type SeriesKey = "actual" | "forecast" | "priorYear";

export const SERIES: readonly {
  key: SeriesKey;
  label: string;
  color: string;
  width: number;
  dash?: string;
}[] = [
  { key: "priorYear", label: "Prior year", color: "var(--chart-prior)", width: 1.5, dash: "1.5 3" },
  { key: "forecast", label: "Forecast", color: "var(--chart-forecast)", width: 1.5, dash: "6 4" },
  { key: "actual", label: "Actual", color: "var(--chart-actual)", width: 2.25 },
];

export const SERIES_LEGEND: LegendItem[] = [
  { label: "Actual", color: "var(--chart-actual)", kind: "line" },
  { label: "Forecast", color: "var(--chart-forecast)", kind: "dashed" },
  { label: "Prior year", color: "var(--chart-prior)", kind: "dotted" },
];

export function seriesSummary(p: PeriodPoint, fmt: Formatters): string {
  return `${fmt.periodLong(p.period)}: actual ${fmt.compactCurrency(p.actual)}, forecast ${fmt.compactCurrency(
    p.forecast,
  )}, prior year ${fmt.compactCurrency(p.priorYear)}`;
}
