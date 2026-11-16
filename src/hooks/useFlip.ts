"use client";

import { useLayoutEffect, useRef } from "react";
import { MOTION_MS, prefersReducedMotion } from "@/lib/motion";
import { useMotionRevision } from "./useMotionRevision";

export function useFlip<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const tops = useRef(new Map<string, number>());
  const seenRevision = useRef<number | null>(null);
  const revision = useMotionRevision();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const byTick = seenRevision.current !== null && revision !== seenRevision.current;
    seenRevision.current = revision;
    const items = [...el.querySelectorAll<HTMLElement>(":scope > [data-flip-key]")];
    const next = new Map(items.map((item) => [item.dataset.flipKey ?? "", item.offsetTop]));
    if (byTick && !prefersReducedMotion()) {
      for (const item of items) {
        if (typeof item.animate !== "function") continue;
        const before = tops.current.get(item.dataset.flipKey ?? "");
        const keyframes =
          before === undefined
            ? [{ opacity: 0 }, { opacity: 1 }]
            : before !== item.offsetTop
              ? [
                  { transform: `translateY(${before - item.offsetTop}px)`, zIndex: 1 },
                  { transform: "none", zIndex: 1 },
                ]
              : null;
        if (keyframes)
          item.animate(keyframes, { duration: MOTION_MS, easing: "cubic-bezier(0.33, 1, 0.68, 1)" });
      }
    }
    tops.current = next;
  });

  return ref;
}
