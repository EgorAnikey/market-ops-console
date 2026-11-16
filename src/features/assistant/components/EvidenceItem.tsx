"use client";

import { ArrowUpRight, Database, ShieldAlert } from "lucide-react";
import type { ResolvedCitation } from "@/domain/citations";
import { METRICS } from "@/domain/metrics";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useDashboardState } from "@/features/dashboard/state/useDashboardState";
import { useFormatters } from "@/features/locale/useFormatters";
import { cn } from "@/lib/cn";

interface EvidenceItemProps {
  id: string;
  citation: ResolvedCitation;
  highlighted: boolean;
  onHover: (n: number | null) => void;
}

export function EvidenceItem({ id, citation: c, highlighted, onHover }: EvidenceItemProps) {
  const fmt = useFormatters();
  const { drillTo } = useDashboardState();
  const kpis = c.verified ? c.kpis : null;

  return (
    <li
      id={id}
      tabIndex={-1}
      onMouseEnter={() => onHover(c.n)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "rounded-md border bg-surface px-2.5 py-2 transition-colors",
        c.verified ? "border-fact-border" : "border-warn/40",
        highlighted && "ring-2 ring-fact/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-fg">
          <span className="num rounded bg-fact-soft px-1 text-[0.6875rem] font-semibold text-fact">
            {c.n}
          </span>
          <span className="truncate">{c.label}</span>
        </p>
        {c.verified ? (
          <button
            type="button"
            onClick={() => drillTo(c.scope, c.period)}
            className="touch-target inline-flex shrink-0 items-center gap-0.5 text-[0.6875rem] font-medium text-accent hover:underline"
          >
            Show<span className="sr-only"> {c.label} in dashboard</span>
            <ArrowUpRight aria-hidden className="size-3" />
          </button>
        ) : null}
      </div>
      {kpis ? (
        <dl className="mt-1.5 grid grid-cols-3 gap-x-2 text-[0.6875rem]">
          {(["revenue", "growthPct", "forecastAttainmentPct"] as const).map((key) => (
            <div key={key}>
              <dt className="text-fg-subtle">{METRICS[key].short}</dt>
              <dd className="num font-medium text-fg">{fmt.metric(METRICS[key], kpis[key])}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-1 flex items-center gap-1 text-[0.6875rem] text-warn">
          <ShieldAlert aria-hidden className="size-3" /> Unverified: {c.unresolved.join(", ")} not found in
          the dataset.
        </p>
      )}
      <p className="mt-1.5 flex items-center gap-1.5 text-[0.6875rem] text-fg-subtle">
        <Database aria-hidden className="size-3 text-fact" />
        {c.scopeName} · {fmt.period(c.period)}
        {c.kpis ? <StatusBadge status={c.kpis.status} className="ml-auto" /> : null}
      </p>
    </li>
  );
}
