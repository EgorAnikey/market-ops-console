"use client";

import { useMemo } from "react";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { marketsInScope } from "@/domain/dataset-index";
import { marketScope } from "@/domain/hierarchy";
import { MAP_METRICS, METRICS, type MapMetricKey } from "@/domain/metrics";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useLive } from "@/features/live/LiveProvider";
import { useFormatters } from "@/features/locale/useFormatters";
import { ChoroplethMap } from "../charts/map/ChoroplethMap";
import { MapLegend } from "../charts/map/MapLegend";
import { metricColorScale } from "../charts/map/map-scale";
import { useWorldGeometry } from "../charts/map/useWorldGeometry";
import { useMarketHealth } from "../hooks/useMarketHealth";
import { shareSnapshotNote, useShareSnapshot } from "../hooks/useShareSnapshot";
import { useMarketRows } from "../hooks/useMarketRows";
import { useDashboardState } from "../state/useDashboardState";
import { useKpiColumns } from "../tables/useKpiColumns";

const TABLE_COLUMNS = ["name", "context", "revenue", "growth", "attainment", "share", "status"] as const;

export function MapPanel({ className }: { className?: string }) {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const { revision } = useLive();
  const { scope, kpi, setKpi, drillTo } = useDashboardState();
  const { all } = useMarketHealth();
  const rows = useMarketRows("all");
  const columns = useKpiColumns(TABLE_COLUMNS);
  const shareAsOf = useShareSnapshot();
  const geometry = useWorldGeometry();
  const inScope = useMemo(() => new Set(marketsInScope(index, scope).map((m) => m.id)), [index, scope]);
  const frame = useMemo(
    () => new Set(marketsInScope(index, { ...scope, marketId: null }).map((m) => m.id)),
    [index, scope],
  );
  const scale = useMemo(
    () =>
      metricColorScale(
        kpi,
        all.map((h) => h.kpis[kpi]),
      ),
    [kpi, all],
  );

  const metricSelect = (
    <Select<MapMetricKey>
      aria-label="Colour map by"
      value={kpi}
      onChange={setKpi}
      options={MAP_METRICS.map((m) => ({
        value: m,
        label: m === "sharePct" && shareAsOf ? `${METRICS[m].label} (${shareAsOf})` : METRICS[m].label,
      }))}
    />
  );

  return (
    <ChartFrame
      className={className}
      title="Markets map"
      description={`Select a country to drill in. Hatching marks markets that need attention.${
        kpi === "sharePct" && shareAsOf ? ` ${shareSnapshotNote(shareAsOf)}` : ""
      }`}
      actions={metricSelect}
      legend={<MapLegend scale={scale} metric={kpi} fmt={fmt} />}
      table={
        <DataTable
          caption="Markets by KPI"
          captionHidden
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          initialSort={{ id: "revenue", dir: "desc" }}
        />
      }
    >
      {geometry.data ? (
        <ChoroplethMap
          countries={geometry.data}
          health={all}
          inScope={inScope}
          frame={frame}
          selectedMarketId={scope.marketId}
          metric={kpi}
          fmt={fmt}
          onSelect={(id) => drillTo(marketScope(index, id, scope.productId))}
          revision={revision}
        />
      ) : geometry.isError ? (
        <p role="alert" className="py-10 text-center text-sm text-fg-muted">
          Map geometry failed to load. Switch to <strong>Table</strong> to see the same data.
        </p>
      ) : (
        <Skeleton className="aspect-[640/330] w-full" />
      )}
    </ChartFrame>
  );
}
