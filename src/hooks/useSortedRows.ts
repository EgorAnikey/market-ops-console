"use client";

import { useMemo, useState } from "react";

export type SortDir = "asc" | "desc";
export interface SortState {
  id: string;
  dir: SortDir;
}

type SortValue = number | string | null;

export function compareSortValues(a: SortValue, b: SortValue, dir: SortDir): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  const result = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b));
  return dir === "asc" ? result : -result;
}

export function useSortedRows<T>(
  rows: readonly T[],
  getValue: (row: T, columnId: string) => SortValue,
  initial: SortState | null = null,
) {
  const [sort, setSort] = useState<SortState | null>(initial);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    return [...rows].sort((a, b) => compareSortValues(getValue(a, sort.id), getValue(b, sort.id), sort.dir));
  }, [rows, sort, getValue]);

  const toggle = (id: string) =>
    setSort((s) => (s?.id === id ? { id, dir: s.dir === "desc" ? "asc" : "desc" } : { id, dir: "desc" }));

  return { sorted, sort, toggle };
}
