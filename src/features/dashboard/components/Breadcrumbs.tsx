"use client";

import { ChevronRight } from "lucide-react";
import { breadcrumbs } from "@/domain/hierarchy";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useFormatters } from "@/features/locale/useFormatters";
import { scopeKey } from "@/domain/scope";
import { useFocusRescue } from "@/hooks/useFocusRescue";
import { useDashboardState } from "../state/useDashboardState";

export function Breadcrumbs() {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const { scope, period, drillTo } = useDashboardState();
  const crumbs = breadcrumbs(index, scope);
  const currentRef = useFocusRescue<HTMLSpanElement>(scopeKey(scope));

  return (
    <nav aria-label="Drill path" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => {
          const current = i === crumbs.length - 1;
          return (
            <li key={`${crumb.kind}-${crumb.label}`} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight aria-hidden className="size-3.5 text-fg-subtle" /> : null}
              {current ? (
                <span ref={currentRef} tabIndex={-1} aria-current="page" className="font-semibold text-fg">
                  {crumb.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => drillTo(crumb.scope)}
                  className="touch-target text-fg-muted hover:text-accent hover:underline"
                >
                  {crumb.label}
                </button>
              )}
            </li>
          );
        })}
        <li className="ml-2 text-xs text-fg-subtle">· {fmt.periodLong(period)}</li>
      </ol>
    </nav>
  );
}
