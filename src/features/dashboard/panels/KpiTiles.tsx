"use client";

import { Sparkline } from "@/components/charts/Sparkline";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { FixedWidth } from "@/components/ui/FixedWidth";
import { STATUS_META } from "@/components/ui/StatusBadge";
import { STATUSES } from "@/contracts/dataset";
import { useLive } from "@/features/live/LiveProvider";
import { useFormatters } from "@/features/locale/useFormatters";
import { KpiTile } from "../components/KpiTile";
import { useMarketHealth } from "../hooks/useMarketHealth";
import { useScopeMetrics } from "../hooks/useScopeMetrics";
import { useValueSamples } from "../hooks/useValueSamples";

export function KpiTiles({ detailed }: { detailed: boolean }) {
  const fmt = useFormatters();
  const samples = useValueSamples();
  const { revision } = useLive();
  const { kpis, points, period } = useScopeMetrics();
  const { scoped } = useMarketHealth();
  const idx = points.findIndex((p) => p.period === period);
  const attention = scoped.filter((h) => h.kpis.status !== "on_track").length;
  const counts = STATUSES.map((s) => ({ s, n: scoped.filter((h) => h.kpis.status === s).length }));

  return (
    <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiTile
        label={`Revenue · ${fmt.period(period)}`}
        value={<AnimatedNumber value={kpis.revenue} format={fmt.compactCurrency} revision={revision} />}
        visual={<Sparkline values={points.slice(0, idx + 1).map((p) => p.actual)} revision={revision} />}
        delta={{
          value: kpis.growthPct,
          figure: fmt.signedPercent(kpis.growthPct),
          samples: samples.signedPercent,
          label: "vs prior year",
        }}
        footnote={
          detailed ? (
            <>
              <span className="block">
                <FixedWidth samples={samples.units}>{fmt.integer(kpis.units)}</FixedWidth> units
              </span>
              <span className="block">prior year {fmt.compactCurrency(kpis.priorYear)}</span>
            </>
          ) : null
        }
      />
      <KpiTile
        label="YoY growth"
        value={<AnimatedNumber value={kpis.growthPct} format={fmt.signedPercent} revision={revision} />}
        delta={{
          value: kpis.momentumPct,
          figure: fmt.signedPercent(kpis.momentumPct),
          samples: samples.signedPercent,
          label: "3-mo momentum",
        }}
        footnote={detailed ? "Last 3 months vs the 3 before" : null}
      />
      <KpiTile
        label="Forecast attainment"
        value={<AnimatedNumber value={kpis.forecastAttainmentPct} format={fmt.percent} revision={revision} />}
        delta={{
          value: kpis.forecastAttainmentPct === null ? null : kpis.forecastAttainmentPct - 100,
          figure: fmt.compactCurrency(Math.abs(kpis.revenue - kpis.forecast)),
          samples: samples.money,
          label: kpis.revenue >= kpis.forecast ? "ahead of plan" : "behind plan",
        }}
        footnote={detailed ? `Forecast ${fmt.compactCurrency(kpis.forecast)}` : null}
      />
      <KpiTile
        label="Markets needing attention"
        value={
          <>
            <FixedWidth samples={samples.count} align="end">
              <AnimatedNumber value={attention} format={fmt.integer} revision={revision} />
            </FixedWidth>{" "}
            of {scoped.length}
          </>
        }
        footnote={
          <ul className="flex flex-col">
            {counts.map(({ s, n }) => {
              const { Icon, label } = STATUS_META[s];
              return (
                <li key={s} className="inline-flex items-center gap-1">
                  <Icon aria-hidden className="size-3" />
                  <FixedWidth samples={samples.count} align="end">
                    <AnimatedNumber value={n} format={fmt.integer} revision={revision} />
                  </FixedWidth>{" "}
                  {label.toLowerCase()}
                </li>
              );
            })}
          </ul>
        }
      />
    </section>
  );
}
