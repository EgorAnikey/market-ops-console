"use client";

import { useMemo } from "react";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { marketScope } from "@/domain/hierarchy";
import { growthMatrix, type MatrixRow } from "@/domain/matrix";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useLive } from "@/features/live/LiveProvider";
import { useFormatters } from "@/features/locale/useFormatters";
import { divergingFill } from "@/lib/viz/color";
import { HEAT_HALF_RANGE, HeatMap } from "../charts/HeatMap";
import { useDashboardState } from "../state/useDashboardState";

export function HeatmapPanel({ className }: { className?: string }) {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const { revision } = useLive();
  const { scope, period, drillTo } = useDashboardState();
  const rows = useMemo(() => growthMatrix(index, { ...scope, marketId: null }), [index, scope]);

  const recent = useMemo(() => index.periods.slice(-6), [index]);
  const columns = useMemo<Column<MatrixRow>[]>(
    () => [
      {
        id: "market",
        header: "Market",
        rowHeader: true,
        sortValue: (r) => r.market.name,
        cell: (r) => r.market.name,
      },
      ...recent.map((p): Column<MatrixRow> => ({
        id: p,
        header: fmt.period(p),
        align: "right",
        sortValue: (r) => r.cells.find((c) => c.period === p)?.value ?? null,
        cell: (r) => {
          const cell = r.cells.find((c) => c.period === p);
          return `${fmt.signedPercent(cell?.value ?? null)}${cell?.anomaly ? " (!)" : ""}`;
        },
      })),
    ],
    [fmt, recent],
  );

  const legend = (
    <div className="flex items-center gap-2 text-[0.6875rem] text-fg-muted">
      <span className="num">{fmt.signedPercent(-HEAT_HALF_RANGE)}</span>
      <span
        aria-hidden
        className="h-2 w-32 rounded-sm"
        style={{
          background: `linear-gradient(90deg, ${divergingFill(-HEAT_HALF_RANGE, 0, HEAT_HALF_RANGE)}, ${divergingFill(0, 0, 1)}, ${divergingFill(HEAT_HALF_RANGE, 0, HEAT_HALF_RANGE)})`,
        }}
      />
      <span className="num">{fmt.signedPercent(HEAT_HALF_RANGE)}</span>
      <span className="ml-2">
        <strong aria-hidden>!</strong> anomaly
      </span>
    </div>
  );

  return (
    <ChartFrame
      className={className}
      title="YoY growth heat map"
      description="Markets × months. Select a cell (or use arrow keys + Enter) to open that market and month."
      legend={legend}
      table={
        <DataTable
          caption="Year-on-year growth, last six months"
          captionHidden
          columns={columns}
          rows={rows}
          rowKey={(r) => r.market.id}
        />
      }
    >
      <HeatMap
        rows={rows}
        periods={index.periods}
        selectedPeriod={period}
        selectedMarketId={scope.marketId}
        fmt={fmt}
        onSelect={(marketId, p) => drillTo(marketScope(index, marketId, scope.productId), p)}
        revision={revision}
      />
    </ChartFrame>
  );
}
