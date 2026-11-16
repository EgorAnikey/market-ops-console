"use client";

import { MessageSquareText } from "lucide-react";
import { StatusBadge, STATUS_META } from "@/components/ui/StatusBadge";
import { riskReasons, type MarketHealth } from "@/domain/health";
import type { Formatters } from "@/lib/format/formatters";
import { cn } from "@/lib/cn";
import { riskReasonText } from "./RiskReasonText";

interface RiskItemProps {
  health: MarketHealth;
  fmt: Formatters;
  compact?: boolean;
  onOpen: () => void;
  onAsk: (question: string) => void;
}

export function RiskItem({ health: h, fmt, compact = false, onOpen, onAsk }: RiskItemProps) {
  const reasons = riskReasons(h).map((r) => riskReasonText(r, fmt));
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="touch-target min-w-0 truncate text-left text-sm font-medium text-fg hover:text-accent hover:underline"
        >
          {h.market.name}
        </button>
        <StatusBadge status={h.kpis.status} />
      </div>
      <ul
        className={cn(
          "num text-xs text-fg-muted",
          compact ? "max-lg:truncate lg:flex lg:flex-wrap lg:gap-x-3" : "flex flex-wrap gap-x-3",
        )}
        title={compact ? reasons.join(" · ") : undefined}
      >
        {reasons.map((text, i) => (
          <li
            key={i}
            className={
              compact
                ? "max-lg:inline max-lg:after:content-['_·_'] max-lg:last:after:content-none"
                : undefined
            }
          >
            {text}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onAsk(`Why is ${h.market.name} ${STATUS_META[h.kpis.status].label.toLowerCase()}?`)}
        className="touch-target inline-flex items-center gap-1 self-start text-[0.6875rem] font-medium text-ai hover:underline"
      >
        <MessageSquareText aria-hidden className="size-3" /> Ask the assistant why
      </button>
    </>
  );
}
