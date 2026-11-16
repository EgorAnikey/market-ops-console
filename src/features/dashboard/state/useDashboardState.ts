"use client";

import { useCallback, useMemo } from "react";
import { useQueryStates } from "nuqs";
import type { Period } from "@/contracts/dataset";
import { isKnownPeriod } from "@/domain/dataset-index";
import { sanitizeScope } from "@/domain/hierarchy";
import type { MapMetricKey } from "@/domain/metrics";
import type { Scope } from "@/domain/scope";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { dashboardParams, type DashboardView } from "./url-params";

const PUSH = { history: "push", scroll: false } as const;
const REPLACE = { history: "replace", scroll: false } as const;

export function useDashboardState() {
  const index = useDatasetIndex();
  const [params, setParams] = useQueryStates(dashboardParams);

  const scope = useMemo(
    () =>
      sanitizeScope(index, { regionId: params.region, marketId: params.market, productId: params.product }),
    [index, params.region, params.market, params.product],
  );
  const period: Period =
    params.period && isKnownPeriod(index, params.period) ? params.period : index.latestPeriod;
  const focus = useMemo(
    () => (scope.marketId ? [] : params.focus.filter((id) => index.marketsById.has(id))),
    [scope.marketId, params.focus, index],
  );

  const drillTo = useCallback(
    (next: Scope, nextPeriod?: Period) =>
      void setParams(
        {
          region: next.regionId,
          market: next.marketId,
          product: next.productId,
          focus: null,
          ...(nextPeriod ? { period: nextPeriod } : {}),
        },
        PUSH,
      ),
    [setParams],
  );

  const setPeriod = useCallback((p: Period) => void setParams({ period: p }, PUSH), [setParams]);
  const setView = useCallback((v: DashboardView) => void setParams({ view: v }, PUSH), [setParams]);
  const setKpi = useCallback((k: MapMetricKey) => void setParams({ kpi: k }, REPLACE), [setParams]);
  const setCompare = useCallback(
    (keys: string[]) => void setParams({ compare: keys.length ? keys : null }, REPLACE),
    [setParams],
  );
  const setFocus = useCallback(
    (ids: string[]) => void setParams({ focus: ids.length ? ids : null }, REPLACE),
    [setParams],
  );

  const setLive = useCallback((on: boolean) => void setParams({ live: on || null }, REPLACE), [setParams]);

  return {
    scope,
    period,
    view: params.view,
    kpi: params.kpi,
    compare: params.compare,
    focus,
    live: params.live,
    drillTo,
    setPeriod,
    setView,
    setKpi,
    setCompare,
    setFocus,
    setLive,
  };
}

export type DashboardState = ReturnType<typeof useDashboardState>;
