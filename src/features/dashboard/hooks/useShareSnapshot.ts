"use client";

import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useFormatters } from "@/features/locale/useFormatters";
import { useDashboardState } from "../state/useDashboardState";

export function useShareSnapshot(): string | null {
  const { latestPeriod } = useDatasetIndex();
  const { period, scope } = useDashboardState();
  const fmt = useFormatters();
  return period === latestPeriod || scope.productId ? null : fmt.period(latestPeriod);
}

export const shareSnapshotNote = (asOf: string): string =>
  `Share is the ${asOf} snapshot: the data has no share history.`;
