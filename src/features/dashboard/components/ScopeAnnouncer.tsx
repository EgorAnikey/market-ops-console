"use client";

import { useEffect } from "react";
import { scopeLabel } from "@/domain/hierarchy";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useFormatters } from "@/features/locale/useFormatters";
import { useDashboardState } from "../state/useDashboardState";

const APP_NAME = "Market Ops";

export function ScopeAnnouncer() {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const { scope, period, view } = useDashboardState();
  const location = `${scopeLabel(index, scope)}, ${fmt.periodLong(period)}`;

  useEffect(() => {
    document.title = `${location} · ${APP_NAME}`;
  }, [location]);

  return (
    <p role="status" className="sr-only">
      Showing {location}, {view} view.
    </p>
  );
}
