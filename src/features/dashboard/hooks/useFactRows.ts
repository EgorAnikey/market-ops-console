"use client";

import { useMemo } from "react";
import type { SeriesRow } from "@/contracts/dataset";
import { rowsInScope } from "@/domain/dataset-index";
import { pctChange, ratioPct } from "@/domain/math";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useDashboardState } from "../state/useDashboardState";

export interface FactRow extends SeriesRow {
  key: string;
  marketName: string;
  productName: string;
  attainmentPct: number | null;
  growthPct: number | null;
}

export function useFactRows(): FactRow[] {
  const index = useDatasetIndex();
  const { scope, focus } = useDashboardState();
  return useMemo(
    () =>
      rowsInScope(index, scope)
        .filter((r) => focus.length === 0 || focus.includes(r.marketId))
        .map((r) => ({
          ...r,
          key: `${r.marketId}-${r.productId}-${r.period}`,
          marketName: index.marketsById.get(r.marketId)?.name ?? r.marketId,
          productName: index.productsById.get(r.productId)?.name ?? r.productId,
          attainmentPct: ratioPct(r.actual, r.forecast),
          growthPct: pctChange(r.actual, r.priorYear),
        }))
        .sort((a, b) => b.period.localeCompare(a.period) || a.marketName.localeCompare(b.marketName)),
    [index, scope, focus],
  );
}
