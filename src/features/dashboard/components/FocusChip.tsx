"use client";

import { X } from "lucide-react";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useDashboardState } from "../state/useDashboardState";

export function FocusChip() {
  const index = useDatasetIndex();
  const { focus, setFocus } = useDashboardState();
  if (focus.length === 0) return null;
  const names = focus.map((id) => index.marketsById.get(id)?.name ?? id);
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent-soft py-0.5 pr-1 pl-2.5 text-xs text-accent">
      <span className="max-w-64 truncate">
        Focused:{" "}
        {names.length > 3 ? `${names.slice(0, 3).join(", ")} +${names.length - 3}` : names.join(", ")}
      </span>
      <button
        type="button"
        onClick={() => setFocus([])}
        aria-label="Clear market focus"
        className="touch-target inline-flex size-6 items-center justify-center rounded-full hover:bg-accent/10"
      >
        <X aria-hidden className="size-3" />
      </button>
    </span>
  );
}
