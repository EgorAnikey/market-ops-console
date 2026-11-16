"use client";

import { useMemo } from "react";
import { timeline } from "@/domain/aggregate";
import { kpisFromTimeline } from "@/domain/kpis";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useDashboardState } from "../state/useDashboardState";

export function useScopeMetrics() {
  const index = useDatasetIndex();
  const { scope, period } = useDashboardState();
  const points = useMemo(() => timeline(index, scope), [index, scope]);
  const kpis = useMemo(() => kpisFromTimeline(index, scope, points, period), [index, scope, points, period]);
  return { points, kpis, scope, period };
}
