"use client";

import { useMemo } from "react";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { Legend } from "@/components/charts/Legend";
import { DataTable, type Column } from "@/components/ui/DataTable";
import type { PeriodPoint } from "@/domain/aggregate";
import { marketsInScope } from "@/domain/dataset-index";
import { scopeLabel } from "@/domain/hierarchy";
import { ratioPct } from "@/domain/math";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useLive } from "@/features/live/LiveProvider";
import { useFormatters } from "@/features/locale/useFormatters";
import { TimeSeriesChart } from "../charts/time-series/TimeSeriesChart";
import { SERIES_LEGEND } from "../charts/time-series/time-series-meta";
import { useScopeMetrics } from "../hooks/useScopeMetrics";
import { useDashboardState } from "../state/useDashboardState";

export function TrendPanel({ className }: { className?: string }) {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const { revision } = useLive();
  const { points, scope, period } = useScopeMetrics();
  const { setPeriod } = useDashboardState();
  const label = scopeLabel(index, scope);
  const anomalies = useMemo(
    () =>
      marketsInScope(index, scope).flatMap((m) =>
        m.kpis.anomalies.map((a) => ({ period: a.period, note: `${m.name}: ${a.note}` })),
      ),
    [index, scope],
  );

  const columns = useMemo<Column<PeriodPoint>[]>(
    () => [
      {
        id: "period",
        header: "Month",
        rowHeader: true,
        sortValue: (p) => p.period,
        cell: (p) => fmt.period(p.period),
      },
      {
        id: "actual",
        header: "Actual",
        align: "right",
        sortValue: (p) => p.actual,
        cell: (p) => fmt.compactCurrency(p.actual),
      },
      {
        id: "forecast",
        header: "Forecast",
        align: "right",
        sortValue: (p) => p.forecast,
        cell: (p) => fmt.compactCurrency(p.forecast),
      },
      {
        id: "prior",
        header: "Prior year",
        align: "right",
        sortValue: (p) => p.priorYear,
        cell: (p) => fmt.compactCurrency(p.priorYear),
      },
      {
        id: "att",
        header: "Attain.",
        align: "right",
        sortValue: (p) => ratioPct(p.actual, p.forecast),
        cell: (p) => fmt.percent(ratioPct(p.actual, p.forecast)),
      },
    ],
    [fmt],
  );

  return (
    <ChartFrame
      className={className}
      title={`Revenue trend · ${label}`}
      description="Click and use ←/→ on the chart to change the period for the whole dashboard."
      legend={
        <Legend items={SERIES_LEGEND}>
          {anomalies.length ? <li className="text-bad">▼ anomaly</li> : null}
        </Legend>
      }
      table={
        <DataTable
          caption={`Monthly revenue for ${label}`}
          captionHidden
          columns={columns}
          rows={points}
          rowKey={(p) => p.period}
          initialSort={{ id: "period", dir: "desc" }}
        />
      }
    >
      <TimeSeriesChart
        points={points}
        selected={period}
        onSelect={setPeriod}
        anomalies={anomalies}
        fmt={fmt}
        entityLabel={label}
        revision={revision}
      />
    </ChartFrame>
  );
}
