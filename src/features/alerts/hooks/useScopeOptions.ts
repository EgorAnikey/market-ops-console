"use client";

import { useMemo } from "react";
import type { SelectItem } from "@/components/ui/Select";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";

export function useScopeOptions(): SelectItem[] {
  const index = useDatasetIndex();
  return useMemo(
    () => [
      { value: "portfolio", label: "Whole portfolio" },
      {
        label: "Regions",
        options: index.dataset.regions.map((r) => ({ value: `region:${r.id}`, label: r.name })),
      },
      {
        label: "Markets",
        options: index.dataset.markets.map((m) => ({ value: `market:${m.id}`, label: m.name })),
      },
    ],
    [index],
  );
}
