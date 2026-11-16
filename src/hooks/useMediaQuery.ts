"use client";

import { useCallback, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

export function useMediaQuery(query: string, enabled = true): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    enabled ? subscribe : noopSubscribe,
    () => enabled && window.matchMedia(query).matches,
    () => false,
  );
}
