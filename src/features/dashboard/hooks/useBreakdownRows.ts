"use client";

import { useMemo } from "react";
import { timeline } from "@/domain/aggregate";
import { previousPeriod } from "@/domain/dataset-index";
import { childEntities } from "@/domain/hierarchy";
import { kpisFromTimeline } from "@/domain/kpis";
import { pctChange } from "@/domain/math";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import type { KpiRow } from "../tables/kpi-row";
import { useDashboardState } from "../state/useDashboardState";

export function useBreakdownRows(): KpiRow[] {
  const index = useDatasetIndex();
  const { scope, period, focus } = useDashboardState();
  return useMemo(() => {
    const prev = previousPeriod(index, period);
    return childEntities(index, scope)
      .filter((e) => e.kind !== "market" || focus.length === 0 || focus.includes(e.id))
      .map((e) => {
        const points = timeline(index, e.scope);
        const prevActual = prev ? points.find((p) => p.period === prev)?.actual : undefined;
        const kpis = kpisFromTimeline(index, e.scope, points, period);
        return {
          id: e.id,
          name: e.name,
          context: null,
          scope: e.scope,
          kpis,
          changePct: pctChange(kpis.revenue, prevActual),
        };
      });
  }, [index, scope, period, focus]);
}
