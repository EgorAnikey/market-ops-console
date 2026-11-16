"use client";

import { useMemo } from "react";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { DataTable } from "@/components/ui/DataTable";
import { useLive } from "@/features/live/LiveProvider";
import { useFormatters } from "@/features/locale/useFormatters";
import { RadarChart } from "../charts/RadarChart";
import { CompareLegend } from "../components/CompareLegend";
import { useRadarEntities } from "../hooks/useRadarEntities";
import { shareSnapshotNote, useShareSnapshot } from "../hooks/useShareSnapshot";
import type { KpiRow } from "../tables/kpi-row";
import { useKpiColumns } from "../tables/useKpiColumns";

const TABLE_COLUMNS = ["name", "revenue", "growth", "attainment", "share", "momentum"] as const;

export function RadarPanel({ className }: { className?: string }) {
  const fmt = useFormatters();
  const { revision } = useLive();
  const { entities, options, keys, add, remove, reset, isCustom, defaultLabel } = useRadarEntities();
  const columns = useKpiColumns(TABLE_COLUMNS, "Entity");
  const shareAsOf = useShareSnapshot();
  const rows = useMemo<KpiRow[]>(
    () =>
      entities.map((e) => ({
        id: e.key,
        name: e.name,
        context: null,
        scope: e.scope,
        kpis: e.kpis,
        changePct: null,
      })),
    [entities],
  );

  return (
    <ChartFrame
      className={className}
      title="Compare"
      description={`Each axis is scaled to the spread of the compared entities.${shareAsOf ? ` ${shareSnapshotNote(shareAsOf)}` : ""}`}
      table={
        <DataTable
          caption="Compared entities"
          captionHidden
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
        />
      }
      legend={
        <CompareLegend
          entities={entities}
          options={options}
          available={options.filter((o) => !keys.includes(o.key))}
          resetLabel={defaultLabel}
          showReset={isCustom}
          onAdd={add}
          onRemove={remove}
          onReset={reset}
        />
      }
    >
      <RadarChart entities={entities} fmt={fmt} revision={revision} />
    </ChartFrame>
  );
}
