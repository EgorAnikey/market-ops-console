"use client";

import { useMemo } from "react";
import { useLive } from "@/features/live/LiveProvider";
import { useFormatters } from "@/features/locale/useFormatters";

const NONE = { reserve: false, money: [], signedPercent: [], count: [], units: [], direction: [] } as const;

export function useValueSamples() {
  const fmt = useFormatters();
  const { enabled } = useLive();
  return useMemo(
    () =>
      enabled
        ? {
            reserve: true,
            money: [88_800, 888_800, 88_800_000, 888_800_000].map(fmt.compactCurrency),
            signedPercent: [-88.8, 88.8].map(fmt.signedPercent),
            count: [fmt.integer(88)],
            units: [fmt.integer(888_888)],
            direction: ["ahead of", "behind"],
          }
        : NONE,
    [fmt, enabled],
  );
}
