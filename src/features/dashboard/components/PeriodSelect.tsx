"use client";

import { useMemo } from "react";
import { Select } from "@/components/ui/Select";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useFormatters } from "@/features/locale/useFormatters";
import { useDashboardState } from "../state/useDashboardState";

export function PeriodSelect() {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const { period, setPeriod } = useDashboardState();
  const options = useMemo(
    () =>
      [...index.periods].reverse().map((p) => ({
        value: p,
        label: `${fmt.period(p)}${p === index.latestPeriod ? " (latest)" : ""}`,
      })),
    [index, fmt],
  );
  return <Select aria-label="Period" value={period} onChange={setPeriod} options={options} />;
}
