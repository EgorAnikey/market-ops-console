"use client";

import { useCallback, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFlip } from "@/hooks/useFlip";
import { useSortedRows, type SortState } from "@/hooks/useSortedRows";

export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => number | string | null;
  align?: "left" | "right";
  rowHeader?: boolean;
}

interface DataTableProps<T> {
  caption: string;
  captionHidden?: boolean;
  columns: readonly Column<T>[];
  rows: readonly T[];
  rowKey: (row: T) => string;
  initialSort?: SortState;
  rowClassName?: (row: T) => string | undefined;
  className?: string;
}

export function DataTable<T>({
  caption,
  captionHidden,
  columns,
  rows,
  rowKey,
  initialSort,
  rowClassName,
  className,
}: DataTableProps<T>) {
  const getValue = useCallback(
    (row: T, id: string) => columns.find((c) => c.id === id)?.sortValue?.(row) ?? null,
    [columns],
  );
  const { sorted, sort, toggle } = useSortedRows(rows, getValue, initialSort ?? null);
  const bodyRef = useFlip<HTMLTableSectionElement>();

  return (
    <div className={cn("relative overflow-auto", className)}>
      <table className="w-full border-collapse text-[0.8125rem]">
        <caption className={cn("pb-2 text-left text-xs text-fg-subtle", captionHidden && "sr-only")}>
          {caption}
        </caption>
        <thead className="sticky top-0 z-10 bg-surface">
          <tr className="border-b border-border">
            {columns.map((col) => {
              const active = sort?.id === col.id;
              const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
              return (
                <th
                  key={col.id}
                  scope="col"
                  aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                  className={cn(
                    "px-2 py-1.5 font-medium text-fg-subtle",
                    col.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  {col.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggle(col.id)}
                      className={cn(
                        "touch-target",
                        "inline-flex items-center gap-1 hover:text-fg",
                        col.align === "right" && "flex-row-reverse",
                      )}
                    >
                      {col.header}
                      <Icon aria-hidden className={cn("size-3", !active && "opacity-40")} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody ref={bodyRef}>
          {sorted.map((row) => (
            <tr
              key={rowKey(row)}
              data-flip-key={rowKey(row)}
              className={cn("border-b border-border last:border-0 hover:bg-surface-2", rowClassName?.(row))}
            >
              {columns.map((col) => {
                const Cell = col.rowHeader ? "th" : "td";
                return (
                  <Cell
                    key={col.id}
                    scope={col.rowHeader ? "row" : undefined}
                    className={cn(
                      "px-2 py-1.5 font-normal",
                      col.align === "right" ? "num text-right" : "text-left",
                    )}
                  >
                    {col.cell(row)}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
