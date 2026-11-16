"use client";

import { useMemo } from "react";
import { marketScope, regionScope } from "@/domain/hierarchy";
import { PORTFOLIO_SCOPE, type Scope } from "@/domain/scope";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";

export interface CommandItem {
  id: string;
  group: "Navigate" | "Regions" | "Markets" | "Products";
  label: string;
  hint: string;
  keywords: string[];
  scope: Scope;
}

export function useCommandItems(current: Scope): CommandItem[] {
  const index = useDatasetIndex();
  return useMemo(() => {
    const { regions, markets, products } = index.dataset;
    return [
      {
        id: "portfolio",
        group: "Navigate",
        label: "Portfolio overview",
        hint: "All markets",
        keywords: ["home", "all"],
        scope: PORTFOLIO_SCOPE,
      },
      ...regions.map((r): CommandItem => ({
        id: `region:${r.id}`,
        group: "Regions",
        label: r.name,
        hint: `${index.marketsByRegion.get(r.id)?.length ?? 0} markets`,
        keywords: [r.id],
        scope: regionScope(r.id),
      })),
      ...markets.map((m): CommandItem => ({
        id: `market:${m.id}`,
        group: "Markets",
        label: m.name,
        hint: index.regionsById.get(m.regionId)?.name ?? "",
        keywords: [m.iso2, m.iso3],
        scope: marketScope(index, m.id),
      })),
      ...products.map((p): CommandItem => ({
        id: `product:${p.id}`,
        group: "Products",
        label: p.name,
        hint: "Filter current view",
        keywords: ["product"],
        scope: { ...current, productId: p.id },
      })),
    ];
  }, [index, current]);
}
