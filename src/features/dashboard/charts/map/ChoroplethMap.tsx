"use client";

import { useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import type { MarketHealth } from "@/domain/health";
import { METRICS, type MetricKey } from "@/domain/metrics";
import { needsAttention } from "@/domain/status";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { STATUS_META } from "@/components/ui/StatusBadge";
import { useTweenedNullable } from "@/hooks/useTweenedNumbers";
import type { Formatters } from "@/lib/format/formatters";
import { ISO3_TO_NUMERIC } from "./iso-numeric";
import { mainland } from "./mainland";
import { metricColorScale } from "./map-scale";
import { MarketShape } from "./MarketShape";
import type { CountryFeature } from "./useWorldGeometry";

const W = 640;
const H = 330;

interface ChoroplethMapProps {
  countries: readonly CountryFeature[];
  health: readonly MarketHealth[];
  inScope: ReadonlySet<string>;
  frame: ReadonlySet<string>;
  selectedMarketId: string | null;
  metric: MetricKey;
  fmt: Formatters;
  onSelect: (marketId: string) => void;
  revision?: number;
}

export function ChoroplethMap(props: ChoroplethMapProps) {
  const { countries, health, inScope, frame, selectedMarketId, metric, fmt, onSelect, revision = 0 } = props;
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const byNumeric = useMemo(
    () => new Map(health.map((h) => [ISO3_TO_NUMERIC[h.market.iso3] ?? "", h])),
    [health],
  );
  const scale = useMemo(
    () =>
      metricColorScale(
        metric,
        health.map((h) => h.kpis[metric]),
      ),
    [metric, health],
  );

  const values = useMemo(() => health.map((h) => h.kpis[metric]), [health, metric]);
  const shown = useTweenedNullable(values, revision);
  const shownById = useMemo(
    () => new Map(health.map((h, i) => [h.market.id, shown[i] ?? null])),
    [health, shown],
  );

  const path = useMemo(() => {
    const focus = countries.filter((c) => frame.has(byNumeric.get(c.id)?.market.id ?? ""));
    const features = focus.length ? focus.map(mainland) : [...countries];
    const projection = geoNaturalEarth1().fitExtent(
      [
        [12, 12],
        [W - 12, H - 12],
      ],
      { type: "FeatureCollection", features },
    );
    return geoPath(projection);
  }, [countries, byNumeric, frame]);

  const describe = (h: MarketHealth) =>
    `${h.market.name}: ${METRICS[metric].label} ${fmt.metric(METRICS[metric], h.kpis[metric])}, ${STATUS_META[h.kpis.status].label}`;
  const hovered = hover ? byNumeric.get(hover.id) : undefined;
  const marketCountries = useMemo(
    () =>
      countries
        .flatMap((c) => {
          const h = byNumeric.get(c.id);
          return h ? [{ c, h }] : [];
        })
        .sort((a, b) => a.h.market.name.localeCompare(b.h.market.name)),
    [countries, byNumeric],
  );

  return (
    <div className="relative overflow-hidden rounded-md bg-surface-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="group"
        aria-label={`Map of markets coloured by ${METRICS[metric].label}`}
      >
        <defs>
          <pattern
            id="hatch-attention"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--fg)" strokeOpacity="0.45" strokeWidth="1.2" />
          </pattern>
        </defs>
        <g aria-hidden>
          {countries
            .filter((c) => !byNumeric.has(c.id))
            .map((c) => (
              <path
                key={c.id}
                d={path(c) ?? ""}
                fill="var(--no-data)"
                stroke="var(--surface)"
                strokeWidth={0.5}
              />
            ))}
        </g>
        {marketCountries.map(({ c, h }) => (
          <MarketShape
            key={c.id}
            d={path(c) ?? ""}
            fill={scale.fill(shownById.get(h.market.id) ?? null)}
            label={`${describe(h)}. Open ${h.market.name}.`}
            selected={h.market.id === selectedMarketId}
            dimmed={!inScope.has(h.market.id)}
            hatched={needsAttention(h.kpis.status)}
            onSelect={() => onSelect(h.market.id)}
            onHover={(pos) => setHover(pos ? { id: c.id, ...pos } : null)}
          />
        ))}
      </svg>
      <ChartTooltip anchor={hover}>
        {hovered ? <p className="font-medium">{describe(hovered)}</p> : null}
      </ChartTooltip>
    </div>
  );
}
