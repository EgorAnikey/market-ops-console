import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { FixedWidth } from "@/components/ui/FixedWidth";
import { cn } from "@/lib/cn";

interface KpiTileProps {
  label: string;
  value: ReactNode;
  delta?: {
    value: number | null;
    figure: string;
    samples: readonly string[];
    label: string;
    goodWhenUp?: boolean;
  };
  footnote?: ReactNode;
  visual?: ReactNode;
}

export function KpiTile({ label, value, delta, footnote, visual }: KpiTileProps) {
  const dir = delta?.value == null || Math.abs(delta.value) < 0.05 ? 0 : Math.sign(delta.value);
  const good = dir === 0 ? null : dir > 0 === (delta?.goodWhenUp ?? true);
  const Icon = dir > 0 ? ArrowUpRight : dir < 0 ? ArrowDownRight : Minus;

  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-[var(--radius-card)] border border-border bg-surface p-3.5 shadow-card">
      <p className="text-xs font-medium text-fg-subtle">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <p className="num text-2xl font-semibold tracking-tight text-fg">{value}</p>
        {visual ? <div className="hidden sm:block">{visual}</div> : null}
      </div>
      {delta ? (
        <p
          className={cn(
            "num flex flex-wrap items-center gap-x-1 text-xs font-medium",
            good === null ? "text-fg-muted" : good ? "text-ok" : "text-bad",
          )}
        >
          <Icon aria-hidden className="size-3.5" />
          <FixedWidth samples={delta.samples}>{delta.figure}</FixedWidth>
          <span className="max-lg:w-full max-lg:pl-[1.125rem]">{delta.label}</span>
        </p>
      ) : null}
      {footnote ? <div className="text-[0.6875rem] text-fg-subtle">{footnote}</div> : null}
    </div>
  );
}
