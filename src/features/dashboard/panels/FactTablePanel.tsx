"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useFormatters } from "@/features/locale/useFormatters";
import { cn } from "@/lib/cn";
import { useFactRows, type FactRow } from "../hooks/useFactRows";

const ROW_HEIGHT = 30;
type Fmt = ReturnType<typeof useFormatters>;
const COLUMNS: { header: string; right?: boolean; cell: (r: FactRow, fmt: Fmt) => string }[] = [
  { header: "Month", cell: (r, f) => f.period(r.period) },
  { header: "Market", cell: (r) => r.marketName },
  { header: "Product", cell: (r) => r.productName },
  { header: "Actual", right: true, cell: (r, f) => f.currency(r.actual) },
  { header: "Forecast", right: true, cell: (r, f) => f.currency(r.forecast) },
  { header: "Attain.", right: true, cell: (r, f) => f.percent(r.attainmentPct) },
  { header: "Prior year", right: true, cell: (r, f) => f.currency(r.priorYear) },
  { header: "YoY", right: true, cell: (r, f) => f.signedPercent(r.growthPct) },
  { header: "Units", right: true, cell: (r, f) => f.integer(r.units) },
];

export function FactTablePanel({ className }: { className?: string }) {
  const fmt = useFormatters();
  const rows = useFactRows();
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  });
  const items = virtualizer.getVirtualItems();
  const padTop = items[0]?.start ?? 0;
  const padBottom = virtualizer.getTotalSize() - (items.at(-1)?.end ?? 0);

  return (
    <Card className={className}>
      <CardHeader
        title="Fact table"
        description={`${fmt.integer(rows.length)} rows · market × product × month`}
      />
      <CardBody>
        <div
          ref={scrollRef}
          className="relative h-96 overflow-auto rounded-md border border-border"
          tabIndex={0}
          role="region"
          aria-label="Fact table, scrollable"
        >
          <table className="w-full border-collapse text-[0.8125rem]" aria-rowcount={rows.length + 1}>
            <thead className="sticky top-0 z-10 bg-surface-2">
              <tr aria-rowindex={1}>
                {COLUMNS.map((c) => (
                  <th
                    key={c.header}
                    scope="col"
                    className={cn(
                      "px-2 py-1.5 font-medium text-fg-subtle",
                      c.right ? "text-right" : "text-left",
                    )}
                  >
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {padTop > 0 ? <tr aria-hidden style={{ height: padTop }} /> : null}
              {items.map((item) => {
                const row = rows[item.index]!;
                return (
                  <tr
                    key={row.key}
                    aria-rowindex={item.index + 2}
                    style={{ height: ROW_HEIGHT }}
                    className="border-b border-border hover:bg-surface-2"
                  >
                    {COLUMNS.map((c) => (
                      <td
                        key={c.header}
                        className={cn("px-2 whitespace-nowrap", c.right && "num text-right")}
                      >
                        {c.cell(row, fmt)}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {padBottom > 0 ? <tr aria-hidden style={{ height: padBottom }} /> : null}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
