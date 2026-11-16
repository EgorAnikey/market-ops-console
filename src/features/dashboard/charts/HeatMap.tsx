"use client";

import { useMemo } from "react";
import type { Period } from "@/contracts/dataset";
import type { MatrixRow } from "@/domain/matrix";
import { useGridNavigation } from "@/hooks/useGridNavigation";
import { useTweenedNullable } from "@/hooks/useTweenedNumbers";
import { onActivate } from "@/lib/a11y";
import { cn } from "@/lib/cn";
import type { Formatters } from "@/lib/format/formatters";
import { divergingFill } from "@/lib/viz/color";

export const HEAT_HALF_RANGE = 25;

interface HeatMapProps {
  rows: readonly MatrixRow[];
  periods: readonly Period[];
  selectedPeriod: Period;
  selectedMarketId: string | null;
  fmt: Formatters;
  onSelect: (marketId: string, period: Period) => void;
  revision?: number;
}

export function HeatMap(props: HeatMapProps) {
  const { rows, periods, selectedPeriod, selectedMarketId, fmt, onSelect, revision = 0 } = props;
  const values = useMemo(() => rows.flatMap((row) => row.cells.map((cell) => cell.value)), [rows]);
  const shown = useTweenedNullable(values, revision);
  const initialCol = Math.max(0, periods.indexOf(selectedPeriod));
  const { onKeyDown, cellProps } = useGridNavigation(rows.length, periods.length, {
    row: 0,
    col: initialCol,
  });

  return (
    <div className="relative overflow-x-auto">
      <table
        role="grid"
        aria-label="Year-on-year growth by market and month"
        className="w-full min-w-[640px] table-fixed border-separate border-spacing-[2px]"
        onKeyDown={onKeyDown}
      >
        <thead>
          <tr>
            <th scope="col" className="w-28">
              <span className="sr-only">Market</span>
            </th>
            {periods.map((p, i) => (
              <th
                key={p}
                scope="col"
                className={cn(
                  "h-5 overflow-visible p-0 text-left text-[9px] font-normal whitespace-nowrap text-fg-subtle",
                  p === selectedPeriod && "text-fg",
                )}
              >
                <span className={i % 3 === 0 ? "" : "sr-only"}>{fmt.period(p)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={row.market.id}>
              <th
                scope="row"
                className={cn(
                  "truncate pr-2 text-left text-xs font-normal whitespace-nowrap text-fg-muted",
                  row.market.id === selectedMarketId && "font-semibold text-fg",
                )}
              >
                {row.market.name}
              </th>
              {row.cells.map((cell, c) => (
                <td
                  key={cell.period}
                  role="gridcell"
                  {...cellProps(r, c)}
                  aria-label={`${row.market.name}, ${fmt.period(cell.period)}: growth ${fmt.signedPercent(cell.value)}${cell.anomaly ? `. Anomaly: ${cell.anomaly}` : ""}`}
                  aria-selected={cell.period === selectedPeriod && row.market.id === selectedMarketId}
                  onClick={() => onSelect(row.market.id, cell.period)}
                  onKeyDown={onActivate(() => onSelect(row.market.id, cell.period))}
                  title={`${row.market.name} · ${fmt.period(cell.period)} · ${fmt.signedPercent(cell.value)}`}
                  className={cn(
                    "relative h-6 cursor-pointer rounded-[3px] p-0 text-center align-middle focus-visible:outline-offset-1",
                    cell.period === selectedPeriod && "ring-1 ring-fg/60",
                  )}
                  style={{
                    background: divergingFill(shown[r * row.cells.length + c] ?? null, 0, HEAT_HALF_RANGE),
                  }}
                >
                  {cell.anomaly ? (
                    <span aria-hidden className="text-[10px] leading-none font-bold text-fg">
                      !
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
