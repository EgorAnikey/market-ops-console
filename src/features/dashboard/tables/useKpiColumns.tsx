"use client";

import { useMemo } from "react";
import type { Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { STATUS_SEVERITY } from "@/domain/status";
import { useFormatters } from "@/features/locale/useFormatters";
import { useShareSnapshot } from "../hooks/useShareSnapshot";
import { useDashboardState } from "../state/useDashboardState";
import type { KpiRow } from "./kpi-row";

export type KpiColumnId =
  "name" | "context" | "revenue" | "growth" | "attainment" | "share" | "momentum" | "change" | "status";

export function useKpiColumns(ids: readonly KpiColumnId[], nameHeader = "Market"): Column<KpiRow>[] {
  const fmt = useFormatters();
  const { drillTo } = useDashboardState();
  const shareAsOf = useShareSnapshot();

  return useMemo(() => {
    const all: Record<KpiColumnId, Column<KpiRow>> = {
      name: {
        id: "name",
        header: nameHeader,
        rowHeader: true,
        sortValue: (r) => r.name,
        cell: (r) => (
          <button
            type="button"
            onClick={() => drillTo(r.scope)}
            className="touch-target font-medium text-fg hover:text-accent hover:underline"
          >
            {r.name}
          </button>
        ),
      },
      context: {
        id: "context",
        header: "Region",
        sortValue: (r) => r.context,
        cell: (r) => <span className="text-fg-muted">{r.context}</span>,
      },
      revenue: {
        id: "revenue",
        header: "Revenue",
        align: "right",
        sortValue: (r) => r.kpis.revenue,
        cell: (r) => fmt.compactCurrency(r.kpis.revenue),
      },
      growth: {
        id: "growth",
        header: "YoY",
        align: "right",
        sortValue: (r) => r.kpis.growthPct,
        cell: (r) => fmt.signedPercent(r.kpis.growthPct),
      },
      attainment: {
        id: "attainment",
        header: "Attain.",
        align: "right",
        sortValue: (r) => r.kpis.forecastAttainmentPct,
        cell: (r) => fmt.percent(r.kpis.forecastAttainmentPct),
      },
      share: {
        id: "share",
        header: shareAsOf ? `Share, ${shareAsOf}` : "Share",
        align: "right",
        sortValue: (r) => r.kpis.sharePct,
        cell: (r) => fmt.percent(r.kpis.sharePct),
      },
      momentum: {
        id: "momentum",
        header: "3-mo",
        align: "right",
        sortValue: (r) => r.kpis.momentumPct,
        cell: (r) => fmt.signedPercent(r.kpis.momentumPct),
      },
      change: {
        id: "change",
        header: "MoM",
        align: "right",
        sortValue: (r) => r.changePct,
        cell: (r) => fmt.signedPercent(r.changePct),
      },
      status: {
        id: "status",
        header: "Status",
        sortValue: (r) => STATUS_SEVERITY[r.kpis.status],
        cell: (r) => <StatusBadge status={r.kpis.status} />,
      },
    };
    return ids.map((id) => all[id]);
  }, [ids, nameHeader, fmt, drillTo, shareAsOf]);
}
