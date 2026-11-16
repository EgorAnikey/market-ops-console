"use client";

import { useMemo } from "react";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { healthToRow, type KpiRow } from "../tables/kpi-row";
import { useDashboardState } from "../state/useDashboardState";
import { useMarketHealth } from "./useMarketHealth";

export function useMarketRows(which: "all" | "scoped" | "peers" | "visible"): KpiRow[] {
  const index = useDatasetIndex();
  const { scope } = useDashboardState();
  const health = useMarketHealth()[which];
  return useMemo(
    () =>
      health.map((h) =>
        healthToRow(h, index.regionsById.get(h.market.regionId)?.name ?? null, scope.productId),
      ),
    [health, index, scope.productId],
  );
}
