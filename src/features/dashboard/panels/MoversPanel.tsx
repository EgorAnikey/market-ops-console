"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { topMovers, type MarketHealth } from "@/domain/health";
import { marketScope } from "@/domain/hierarchy";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useFlip } from "@/hooks/useFlip";
import { useFormatters } from "@/features/locale/useFormatters";
import { useMarketHealth } from "../hooks/useMarketHealth";
import { useDashboardState } from "../state/useDashboardState";

export function MoversPanel({ className }: { className?: string }) {
  const fmt = useFormatters();
  const { period } = useDashboardState();
  const { gainers, decliners } = topMovers(useMarketHealth().scoped);

  return (
    <Card className={className}>
      <CardHeader
        title="Top movers"
        description={`Revenue change vs the previous month · ${fmt.period(period)}`}
      />
      <CardBody className="grid grid-cols-2 gap-4 pt-2">
        <MoverList title="Up" items={gainers} up />
        <MoverList title="Down" items={decliners} up={false} />
      </CardBody>
    </Card>
  );
}

const SLOTS = 3;

function MoverList({ title, items, up }: { title: string; items: MarketHealth[]; up: boolean }) {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const { scope, drillTo } = useDashboardState();
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const listRef = useFlip<HTMLOListElement>();
  return (
    <div className="min-w-0">
      <h3 className="mb-1.5 text-xs font-medium text-fg-subtle">{title}</h3>
      <ol ref={listRef} className="flex flex-col gap-1">
        {items.map((h) => (
          <li
            key={h.market.id}
            data-flip-key={h.market.id}
            className="relative flex items-center justify-between gap-2 bg-surface text-sm"
          >
            <button
              type="button"
              onClick={() => drillTo(marketScope(index, h.market.id, scope.productId))}
              className="touch-target min-w-0 truncate text-left text-fg hover:text-accent hover:underline"
            >
              {h.market.name}
            </button>
            <span
              className={`num inline-flex shrink-0 items-center gap-0.5 text-xs font-medium whitespace-nowrap ${up ? "text-ok" : "text-bad"}`}
            >
              <Icon aria-hidden className="size-3.5" />
              {fmt.signedPercent(h.changePct)}
            </span>
          </li>
        ))}
        {Array.from({ length: SLOTS - items.length }, (_, i) => {
          const none = items.length === 0 && i === 0;
          return (
            <li key={`slot-${i}`} aria-hidden={!none || undefined} className="flex items-center text-sm">
              <span className="touch-target inline-flex items-center">
                {none ? <span className="text-xs text-fg-subtle">None</span> : "\u00a0"}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
