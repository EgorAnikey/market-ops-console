"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { childKind, type ChildKind } from "@/domain/hierarchy";
import { useFormatters } from "@/features/locale/useFormatters";
import { useBreakdownRows } from "../hooks/useBreakdownRows";
import { useDashboardState } from "../state/useDashboardState";
import { useKpiColumns } from "../tables/useKpiColumns";

const CHILD_LABEL: Record<ChildKind, string> = { region: "Region", market: "Market", product: "Product" };
const COLUMNS = ["name", "revenue", "change", "growth", "attainment", "share", "momentum", "status"] as const;

export function BreakdownPanel({ className }: { className?: string }) {
  const fmt = useFormatters();
  const { scope, period, focus } = useDashboardState();
  const kind = childKind(scope);
  const label = CHILD_LABEL[kind];
  const rows = useBreakdownRows();
  const narrowed = focus.length > 0 && kind === "market";
  const columns = useKpiColumns(COLUMNS, label);

  return (
    <Card className={className}>
      <CardHeader
        title={`Breakdown by ${label.toLowerCase()}`}
        description={`${rows.length} rows · ${fmt.period(period)}${narrowed ? " · narrowed by scatter selection" : ""}. Select a name to drill in.`}
      />
      <CardBody>
        <DataTable
          caption={`KPIs by ${label.toLowerCase()}`}
          captionHidden
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          initialSort={{ id: "revenue", dir: "desc" }}
        />
      </CardBody>
    </Card>
  );
}
