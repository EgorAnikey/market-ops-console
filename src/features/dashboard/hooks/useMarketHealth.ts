"use client";

import { useMemo } from "react";
import { marketsInScope } from "@/domain/dataset-index";
import { marketHealth } from "@/domain/health";
import { PORTFOLIO_SCOPE } from "@/domain/scope";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useDashboardState } from "../state/useDashboardState";

export function useMarketHealth() {
  const index = useDatasetIndex();
  const { scope, period, focus } = useDashboardState();
  const productId = scope.productId;

  const all = useMemo(
    () => marketHealth(index, { ...PORTFOLIO_SCOPE, productId }, period),
    [index, productId, period],
  );
  const scoped = useMemo(() => {
    const ids = new Set(marketsInScope(index, scope).map((m) => m.id));
    return all.filter((h) => ids.has(h.market.id));
  }, [all, index, scope]);
  const peers = useMemo(() => {
    const market = scope.marketId ? index.marketsById.get(scope.marketId) : undefined;
    return market ? all.filter((h) => h.market.regionId === market.regionId) : scoped;
  }, [all, scoped, index, scope.marketId]);
  const visible = useMemo(
    () => (focus.length ? scoped.filter((h) => focus.includes(h.market.id)) : scoped),
    [scoped, focus],
  );

  return { all, scoped, peers, visible };
}
