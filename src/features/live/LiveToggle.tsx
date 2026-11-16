"use client";

import { Button } from "@/components/ui/Button";
import { useDashboardState } from "@/features/dashboard/state/useDashboardState";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useFormatters } from "@/features/locale/useFormatters";
import { cn } from "@/lib/cn";
import { useLive } from "./LiveProvider";

export function LiveToggle() {
  const { enabled, status, updatedAt, setEnabled } = useLive();
  const fmt = useFormatters();
  const { latestPeriod } = useDatasetIndex();
  const { period, setPeriod } = useDashboardState();
  const viewingPast = enabled && period !== latestPeriod;
  const note =
    status === "signed-out"
      ? "Sign in again to resume"
      : status === "reconnecting"
        ? "Reconnecting…"
        : updatedAt && status === "live"
          ? `Updated ${fmt.time(updatedAt)}`
          : "Connecting…";

  return (
    <div className="flex items-center gap-2">
      <Button
        aria-pressed={enabled}
        onClick={() => setEnabled(!enabled)}
        title={enabled ? "Pause live updates" : "Update the latest month live"}
        className="aria-pressed:border-ok aria-pressed:text-ok"
      >
        <span
          aria-hidden
          className={cn(
            "size-2 rounded-full",
            !enabled && "border border-fg-subtle",
            enabled && (status === "reconnecting" || status === "signed-out" ? "bg-warn" : "bg-ok"),
            status === "live" && "animate-pulse",
          )}
        />
        Live
      </Button>
      {viewingPast ? (
        <button
          type="button"
          onClick={() => setPeriod(latestPeriod)}
          className="touch-target text-xs text-accent hover:underline"
        >
          Show live month ({fmt.period(latestPeriod)})
        </button>
      ) : enabled ? (
        <span className="num hidden text-xs text-fg-subtle lg:inline">{note}</span>
      ) : null}
    </div>
  );
}
