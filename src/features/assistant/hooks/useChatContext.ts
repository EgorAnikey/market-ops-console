"use client";

import { useMemo } from "react";
import type { ChatContext } from "@/contracts/chat";
import { scopeLabel } from "@/domain/hierarchy";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useDashboardState } from "@/features/dashboard/state/useDashboardState";
import { useFormatters } from "@/features/locale/useFormatters";

export function useChatContext(): { context: ChatContext; label: string } {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const { scope, period } = useDashboardState();
  return useMemo(
    () => ({
      context: { ...scope, period },
      label: `${scopeLabel(index, scope)} · ${fmt.period(period)}`,
    }),
    [index, fmt, scope, period],
  );
}
