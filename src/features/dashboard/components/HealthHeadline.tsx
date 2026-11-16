"use client";

import { useMemo, type ReactNode } from "react";
import { Database } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Badge } from "@/components/ui/Badge";
import { FixedWidth } from "@/components/ui/FixedWidth";
import { atRiskMarkets } from "@/domain/health";
import { scopeLabel } from "@/domain/hierarchy";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useLive } from "@/features/live/LiveProvider";
import { useFormatters } from "@/features/locale/useFormatters";
import { useMarketHealth } from "../hooks/useMarketHealth";
import { useScopeMetrics } from "../hooks/useScopeMetrics";
import { useValueSamples } from "../hooks/useValueSamples";

interface SentenceProps {
  scope: string;
  period: string;
  revenue: ReactNode;
  gap: ReactNode;
  direction: string;
  attention: ReactNode;
  total: number;
  worst: string | null;
  directionSamples: readonly string[];
}

function Sentence(props: SentenceProps) {
  const { scope, period, revenue, gap, direction, attention, total, worst, directionSamples } = props;
  return (
    <>
      <strong className="font-semibold">{scope}</strong> in {period}: {revenue} revenue, {gap}{" "}
      <FixedWidth samples={directionSamples}>{direction}</FixedWidth> forecast.{" "}
      {total > 1 ? (
        <>
          {attention} of {total} markets need attention
          {worst ? (
            <>
              ; most urgent is <strong className="font-semibold">{worst}</strong>
            </>
          ) : null}
          .
        </>
      ) : null}
    </>
  );
}

export function HealthHeadline() {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const samples = useValueSamples();
  const { revision } = useLive();
  const { kpis, scope, period } = useScopeMetrics();
  const { scoped } = useMarketHealth();
  const risky = atRiskMarkets(scoped);
  const gap = kpis.revenue - kpis.forecast;
  const longestName = useMemo(
    () => scoped.reduce((a, h) => (h.market.name.length > a.length ? h.market.name : a), ""),
    [scoped],
  );
  const shared = {
    scope: scopeLabel(index, scope),
    period: fmt.periodLong(period),
    total: scoped.length,
    directionSamples: samples.direction,
  };
  const money = (value: ReactNode) => (
    <FixedWidth samples={samples.money} className="num">
      {value}
    </FixedWidth>
  );

  return (
    <div className="flex flex-col gap-1.5 rounded-[var(--radius-card)] border border-border bg-surface px-4 py-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div className="grid grid-cols-1 text-[0.9375rem] leading-snug text-fg *:col-start-1 *:row-start-1">
        {samples.reserve ? (
          <p aria-hidden className="invisible">
            <Sentence
              {...shared}
              revenue={money(samples.money[0] ?? "")}
              gap={money(samples.money[0] ?? "")}
              direction="ahead of"
              attention={<FixedWidth samples={samples.count}>{samples.count[0] ?? ""}</FixedWidth>}
              worst={longestName}
            />
          </p>
        ) : null}
        <p>
          <Sentence
            {...shared}
            revenue={money(
              <AnimatedNumber value={kpis.revenue} format={fmt.compactCurrency} revision={revision} />,
            )}
            gap={money(
              <AnimatedNumber value={Math.abs(gap)} format={fmt.compactCurrency} revision={revision} />,
            )}
            direction={gap >= 0 ? "ahead of" : "behind"}
            attention={
              <FixedWidth samples={samples.count} align="end" className="num">
                <AnimatedNumber value={risky.length} format={fmt.integer} revision={revision} />
              </FixedWidth>
            }
            worst={risky[0]?.market.name ?? null}
          />
        </p>
      </div>
      <Badge tone="fact" className="self-start sm:self-auto">
        <Database aria-hidden className="size-3" /> Computed from source data
      </Badge>
    </div>
  );
}
