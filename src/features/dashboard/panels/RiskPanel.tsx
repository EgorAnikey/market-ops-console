"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { atRiskMarkets, type MarketHealth } from "@/domain/health";
import { marketScope } from "@/domain/hierarchy";
import { useAssistantActions } from "@/features/assistant/AssistantProvider";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useFormatters } from "@/features/locale/useFormatters";
import { useFlip } from "@/hooks/useFlip";
import { cn } from "@/lib/cn";
import { RiskItem } from "../components/RiskItem";
import { useMarketHealth } from "../hooks/useMarketHealth";
import { useDashboardState } from "../state/useDashboardState";

const PHONE_SLOTS = 3;
const SLOT = "max-lg:h-[5.25rem] max-lg:overflow-hidden pointer-coarse:max-lg:h-[7rem]";

export function RiskPanel({ className }: { className?: string }) {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const { period, scope, drillTo } = useDashboardState();
  const { prefill } = useAssistantActions();
  const risky = atRiskMarkets(useMarketHealth().scoped);
  const listRef = useFlip<HTMLUListElement>();
  const [showAll, setShowAll] = useState(false);

  const item = (h: MarketHealth, compact: boolean) => (
    <RiskItem
      health={h}
      fmt={fmt}
      compact={compact}
      onOpen={() => {
        setShowAll(false);
        drillTo(marketScope(index, h.market.id, scope.productId));
      }}
      onAsk={(question) => {
        setShowAll(false);
        prefill(question);
      }}
    />
  );

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader title="Top risks" description={`Markets off track or at risk · ${fmt.period(period)}`} />
      <div className="relative lg:min-h-[22rem] lg:flex-1">
        <CardBody className="pt-2 lg:absolute lg:inset-0 lg:overflow-y-auto">
          {risky.length === 0 ? (
            <div className="flex items-center justify-center max-lg:h-[15.75rem] pointer-coarse:max-lg:h-[21rem]">
              <EmptyState icon={CircleCheck} title="Every market in view is on track" />
            </div>
          ) : (
            <ul ref={listRef} className="flex flex-col divide-y divide-border">
              {risky.map((h, i) => (
                <li
                  key={h.market.id}
                  data-flip-key={h.market.id}
                  className={cn(
                    "relative flex flex-col gap-1 bg-surface py-2.5 first:pt-0",
                    SLOT,
                    i >= PHONE_SLOTS && "max-lg:hidden",
                  )}
                >
                  {item(h, true)}
                </li>
              ))}
              {Array.from({ length: Math.max(0, PHONE_SLOTS - risky.length) }, (_, i) => (
                <li key={`slot-${i}`} aria-hidden className={cn("invisible lg:hidden", SLOT)} />
              ))}
            </ul>
          )}
          <div className="flex h-10 items-end lg:hidden">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              disabled={risky.length === 0}
              className="touch-target text-xs font-medium text-accent hover:underline disabled:invisible"
            >
              All {risky.length} {risky.length === 1 ? "risk" : "risks"}
            </button>
          </div>
        </CardBody>
      </div>
      <Dialog open={showAll} onClose={() => setShowAll(false)} title={`Top risks · ${fmt.period(period)}`}>
        <ul className="flex flex-col divide-y divide-border">
          {risky.map((h) => (
            <li key={h.market.id} className="flex flex-col gap-1 py-2.5">
              {item(h, false)}
            </li>
          ))}
        </ul>
      </Dialog>
    </Card>
  );
}
