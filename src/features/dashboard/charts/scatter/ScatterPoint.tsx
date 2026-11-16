import type { MarketHealth } from "@/domain/health";
import { StatusMarker } from "@/components/charts/StatusMarker";
import { STATUS_META } from "@/components/ui/StatusBadge";
import { onActivate as onKeyActivate } from "@/lib/a11y";
import type { Formatters } from "@/lib/format/formatters";

interface ScatterPointProps {
  health: MarketHealth;
  cx: number;
  cy: number;
  r: number;
  mode: "focus" | "current";
  selected: boolean;
  dimmed: boolean;
  fmt: Formatters;
  onActivate: (marketId: string) => void;
}

export function ScatterPoint(props: ScatterPointProps) {
  const { health: h, cx, cy, r, mode, selected, dimmed, fmt, onActivate } = props;
  const label = `${h.market.name}: growth ${fmt.signedPercent(h.kpis.growthPct)}, share ${fmt.percent(
    h.kpis.sharePct,
  )}, revenue ${fmt.compactCurrency(h.kpis.revenue)}, ${STATUS_META[h.kpis.status].label}`;
  return (
    <g
      opacity={dimmed ? (mode === "current" ? 0.55 : 0.3) : 1}
      style={{ transform: `translate(${cx}px, ${cy}px)` }}
    >
      <StatusMarker
        status={h.kpis.status}
        cx={0}
        cy={0}
        r={r}
        fillOpacity={0.75}
        stroke={selected ? "var(--fg)" : "var(--surface)"}
        strokeWidth={selected ? 2 : 1}
        role={mode === "focus" ? "checkbox" : "button"}
        aria-checked={mode === "focus" ? selected : undefined}
        aria-current={mode === "current" && selected ? "true" : undefined}
        tabIndex={0}
        aria-label={label}
        className="viz-focus cursor-pointer"
        onClick={() => onActivate(h.market.id)}
        onKeyDown={onKeyActivate(() => onActivate(h.market.id))}
      />
    </g>
  );
}
