"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { seriesColor } from "@/lib/viz/color";
import { MAX_COMPARE, type CompareOption } from "../hooks/useRadarEntities";

interface CompareLegendProps {
  entities: readonly { key: string; name: string }[];
  options: readonly CompareOption[];
  available: readonly CompareOption[];
  resetLabel: string;
  showReset: boolean;
  onAdd: (key: string) => void;
  onRemove: (key: string) => void;
  onReset: () => void;
}

export function CompareLegend(props: CompareLegendProps) {
  const { entities, options, available, resetLabel, showReset, onAdd, onRemove, onReset } = props;
  const longest = useMemo(
    () => [...options].sort((a, b) => b.name.length - a.name.length).slice(0, MAX_COMPARE),
    [options],
  );
  const canAdd = entities.length < MAX_COMPARE;

  const row = (
    chips: readonly { key: string; name: string }[],
    add: boolean,
    reset: boolean,
    ghost = false,
  ) => (
    <div
      aria-hidden={ghost || undefined}
      inert={ghost}
      className={cn("flex flex-wrap content-start items-center gap-1.5", ghost && "invisible")}
    >
      {chips.map((e, i) => (
        <span
          key={e.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-border py-0.5 pr-1 pl-2 text-xs"
        >
          <span aria-hidden className="size-2.5 rounded-full" style={{ background: seriesColor(i) }} />
          {e.name}
          <button
            type="button"
            onClick={() => onRemove(e.key)}
            aria-label={`Remove ${e.name} from comparison`}
            className="touch-target inline-flex size-6 items-center justify-center rounded-full text-fg-subtle hover:bg-surface-2 hover:text-fg disabled:opacity-40"
            disabled={chips.length <= 1}
          >
            <X aria-hidden className="size-3" />
          </button>
        </span>
      ))}
      {add ? (
        <Select
          aria-label="Add to comparison"
          value={null}
          placeholder="+ Add…"
          onChange={onAdd}
          options={available.map((o) => ({ value: o.key, label: o.name }))}
          className="w-32"
        />
      ) : null}
      {reset ? (
        <button type="button" onClick={onReset} className="touch-target text-xs text-accent hover:underline">
          Reset to {resetLabel}
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="grid grid-cols-1 *:col-start-1 *:row-start-1">
      {row(longest, false, true, true)}
      {row(longest.slice(0, MAX_COMPARE - 1), true, true, true)}
      {row(entities, canAdd, showReset)}
    </div>
  );
}
