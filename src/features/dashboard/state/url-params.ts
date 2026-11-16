import { parseAsArrayOf, parseAsBoolean, parseAsString, parseAsStringLiteral } from "nuqs";
import { MAP_METRICS } from "@/domain/metrics";

export const VIEWS = ["executive", "analyst"] as const;
export type DashboardView = (typeof VIEWS)[number];

export const dashboardParams = {
  region: parseAsString,
  market: parseAsString,
  product: parseAsString,
  period: parseAsString,
  view: parseAsStringLiteral(VIEWS).withDefault("executive"),
  kpi: parseAsStringLiteral(MAP_METRICS).withDefault("growthPct"),
  compare: parseAsArrayOf(parseAsString).withDefault([]),
  focus: parseAsArrayOf(parseAsString).withDefault([]),
  live: parseAsBoolean.withDefault(false),
};
