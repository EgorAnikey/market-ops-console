"use client";

import { Loader2, Trash2 } from "lucide-react";
import { METRICS } from "@/domain/metrics";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ClientAlertRule } from "../api";
import { useRuleMatches } from "../hooks/useRuleMatches";

const OP = { lt: "<", gt: ">" } as const;

export function AlertRuleItem({
  rule,
  onDelete,
}: {
  rule: ClientAlertRule;
  onDelete?: (id: string) => void;
}) {
  const flagged = useRuleMatches(rule);
  const summary = rule.conditions
    .map((c) => `${METRICS[c.metric].short} ${OP[c.operator]} ${c.threshold}%`)
    .join(rule.match === "all" ? " and " : " or ");

  return (
    <li
      aria-busy={rule.optimistic ?? false}
      className={`flex flex-col gap-1 py-2.5 ${rule.optimistic ? "opacity-70" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-1.5 text-sm font-medium">
          <span className="truncate">{rule.name}</span>
          <Badge tone={rule.severity === "critical" ? "bad" : "warn"}>{rule.severity}</Badge>
        </p>
        {rule.optimistic ? (
          <span className="inline-flex items-center gap-1 text-[0.6875rem] text-fg-subtle">
            <Loader2 aria-hidden className="size-3 animate-spin" /> Saving…
          </span>
        ) : onDelete ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(rule.id)}
            aria-label={`Delete alert ${rule.name}`}
          >
            <Trash2 aria-hidden className="size-3.5" />
          </Button>
        ) : null}
      </div>
      <p className="num text-xs text-fg-muted">{summary}</p>
      {flagged.length ? (
        <p className="truncate text-xs text-warn" title={flagged.map((m) => m.name).join(", ")}>
          Triggered by {flagged.map((m) => m.name).join(", ")}
        </p>
      ) : (
        <p className="truncate text-xs text-fg-subtle">Not triggered</p>
      )}
    </li>
  );
}
