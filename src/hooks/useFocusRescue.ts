"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useFocusRescue<T extends HTMLElement>(trigger: unknown, target?: RefObject<T | null>) {
  const ownRef = useRef<T>(null);
  const ref = target ?? ownRef;
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const active = document.activeElement;
    if (!active || active === document.body) ref.current?.focus({ preventScroll: true });
  }, [trigger, ref]);

  return ref;
}
