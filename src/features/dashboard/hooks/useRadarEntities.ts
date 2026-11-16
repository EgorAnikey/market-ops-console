"use client";

import { useMemo } from "react";
import { computeKpis } from "@/domain/kpis";
import { marketScope, regionScope } from "@/domain/hierarchy";
import type { DatasetIndex } from "@/domain/dataset-index";
import type { Scope } from "@/domain/scope";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import type { RadarEntity } from "../charts/radar-model";
import { useDashboardState } from "../state/useDashboardState";

export const MAX_COMPARE = 5;

export interface CompareOption {
  key: string;
  name: string;
  scope: Scope;
}

export function compareOptions(index: DatasetIndex): CompareOption[] {
  return [
    ...index.dataset.regions.map((r) => ({ key: `region:${r.id}`, name: r.name, scope: regionScope(r.id) })),
    ...index.dataset.markets.map((m) => ({
      key: `market:${m.id}`,
      name: m.name,
      scope: marketScope(index, m.id),
    })),
  ];
}

function defaultKeys(index: DatasetIndex, scope: Scope): string[] {
  const regionId = scope.regionId;
  if (!regionId) return index.dataset.regions.map((r) => `region:${r.id}`);
  const peers = (index.marketsByRegion.get(regionId) ?? []).map((m) => `market:${m.id}`);
  const first = scope.marketId ? [`market:${scope.marketId}`] : [];
  return [...new Set([...first, ...peers])].slice(0, MAX_COMPARE);
}

function defaultLabel(index: DatasetIndex, scope: Scope): string {
  const region = index.dataset.regions.find((r) => r.id === scope.regionId);
  return region ? `${region.name} markets` : "all regions";
}

export function useRadarEntities() {
  const index = useDatasetIndex();
  const { scope, period, compare, setCompare } = useDashboardState();
  const options = useMemo(() => compareOptions(index), [index]);
  const byKey = useMemo(() => new Map(options.map((o) => [o.key, o])), [options]);

  const keys = useMemo(() => {
    const valid = compare.filter((k) => byKey.has(k)).slice(0, MAX_COMPARE);
    return valid.length ? valid : defaultKeys(index, scope);
  }, [compare, byKey, index, scope]);

  const entities = useMemo<RadarEntity[]>(
    () =>
      keys.flatMap((key) => {
        const o = byKey.get(key);
        if (!o) return [];
        const s = { ...o.scope, productId: scope.productId };
        return [{ key, name: o.name, scope: s, kpis: computeKpis(index, s, period) }];
      }),
    [keys, byKey, index, scope.productId, period],
  );

  return {
    entities,
    options,
    keys,
    add: (key: string) => setCompare([...keys, key].slice(0, MAX_COMPARE)),
    remove: (key: string) => setCompare(keys.filter((k) => k !== key)),
    reset: () => setCompare([]),
    isCustom: compare.length > 0,
    defaultLabel: defaultLabel(index, scope),
  };
}
