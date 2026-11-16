"use client";

import { useMemo } from "react";
import { Select } from "@/components/ui/Select";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useDashboardState } from "../state/useDashboardState";

const ALL = "__all";

export function ProductFilter() {
  const index = useDatasetIndex();
  const { scope, drillTo } = useDashboardState();
  const options = useMemo(
    () => [
      { value: ALL, label: "All products" },
      ...index.dataset.products.map((p) => ({ value: p.id, label: p.name })),
    ],
    [index],
  );
  return (
    <Select
      aria-label="Product filter"
      value={scope.productId ?? ALL}
      onChange={(id) => drillTo({ ...scope, productId: id === ALL ? null : id })}
      options={options}
    />
  );
}
