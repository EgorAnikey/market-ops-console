"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";
import { useWatch } from "react-hook-form";
import { useFormatters } from "@/features/locale/useFormatters";
import { useDashboardState } from "@/features/dashboard/state/useDashboardState";
import type { AlertFormValues } from "../form-schema";
import { useRuleMatches } from "../hooks/useRuleMatches";

export function AlertPreview() {
  const fmt = useFormatters();
  const { period } = useDashboardState();
  const [scope, match, conditions] = useWatch<AlertFormValues, ["scope", "match", "conditions"]>({
    name: ["scope", "match", "conditions"],
  });
  const flagged = useRuleMatches({ scope, match, conditions: conditions ?? [] });
  const count = `${flagged.length} ${flagged.length === 1 ? "market" : "markets"}`;
  const names = flagged.length ? flagged.map((m) => m.name).join(", ") : "No market crosses it right now";
  const summary = `In ${fmt.period(period)} this rule would flag ${count}`;

  const ruleKey = JSON.stringify([scope, match, conditions]);
  const [announced, setAnnounced] = useState({ ruleKey, text: `${summary}: ${names}.` });
  if (announced.ruleKey !== ruleKey) setAnnounced({ ruleKey, text: `${summary}: ${names}.` });

  return (
    <div className="flex items-start gap-2 rounded-md border border-fact-border bg-fact-soft px-2.5 py-2 text-xs text-fg">
      <BellRing aria-hidden className="mt-0.5 size-3.5 shrink-0 text-fact" />
      <div className="min-w-0">
        <p>
          In {fmt.period(period)} this rule would flag <strong className="num">{count}</strong>
        </p>
        <p className="truncate text-fg-muted" title={names}>
          {names}
        </p>
      </div>
      <p role="status" aria-atomic="true" className="sr-only">
        {announced.text}
      </p>
    </div>
  );
}
