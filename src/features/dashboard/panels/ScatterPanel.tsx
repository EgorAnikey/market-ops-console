"use client";

import { ChartFrame } from "@/components/charts/ChartFrame";
import { Legend } from "@/components/charts/Legend";
import { PieChart } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { marketScope } from "@/domain/hierarchy";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useLive } from "@/features/live/LiveProvider";
import { useFormatters } from "@/features/locale/useFormatters";
import { ScatterChart, type ScatterSelection } from "../charts/scatter/ScatterChart";
import { ScatterDescription } from "../components/ScatterDescription";
import { useMarketHealth } from "../hooks/useMarketHealth";
import { useShareSnapshot } from "../hooks/useShareSnapshot";
import { useMarketRows } from "../hooks/useMarketRows";
import { useDashboardState } from "../state/useDashboardState";
import { useKpiColumns } from "../tables/useKpiColumns";

const TABLE_COLUMNS = ["name", "growth", "share", "revenue", "status"] as const;
const LEGEND = [
  { label: "On track", color: "var(--ok)", kind: "dot" as const },
  { label: "At risk", color: "var(--warn)", kind: "triangle" as const },
  { label: "Off track", color: "var(--bad)", kind: "diamond" as const },
];

export function ScatterPanel({ className }: { className?: string }) {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const { revision } = useLive();
  const { scope, focus, setFocus, drillTo } = useDashboardState();
  const { peers } = useMarketHealth();
  const rows = useMarketRows("peers");
  const current = scope.marketId ? index.marketsById.get(scope.marketId) : undefined;
  const region = current ? index.regionsById.get(current.regionId)?.name : undefined;
  const selection: ScatterSelection = current
    ? {
        kind: "current",
        id: current.id,
        onOpen: (id) => drillTo(marketScope(index, id, scope.productId)),
      }
    : { kind: "focus", ids: focus, onChange: setFocus };
  const columns = useKpiColumns(TABLE_COLUMNS);
  const shareAsOf = useShareSnapshot();
  const noShare = scope.productId ? (
    <EmptyState icon={PieChart} title="Market share isn't tracked per product">
      The data only has share for all products together.{" "}
      <button
        type="button"
        onClick={() => drillTo({ ...scope, productId: null })}
        className="touch-target text-accent hover:underline"
      >
        Show all products
      </button>
    </EmptyState>
  ) : null;

  return (
    <ChartFrame
      className={className}
      title="Growth vs share"
      description={
        <ScatterDescription
          current={current}
          region={region}
          shareAsOf={shareAsOf}
          unavailable={noShare !== null}
          onSelectSeveral={() =>
            current && drillTo({ regionId: current.regionId, marketId: null, productId: scope.productId })
          }
        />
      }
      legend={<Legend items={LEGEND} />}
      table={
        <DataTable
          caption="Growth and share by market"
          captionHidden
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          initialSort={{ id: "growth", dir: "desc" }}
        />
      }
    >
      <ScatterChart
        health={peers}
        selection={selection}
        fmt={fmt}
        revision={revision}
        shareLabel={shareAsOf ? `Share, ${shareAsOf}` : "Share"}
        empty={noShare}
      />
    </ChartFrame>
  );
}
