"use client";

import { useLayoutEffect, useRef } from "react";
import { EMPTY_VALUE } from "@/lib/format/formatters";
import { easeOut, MOTION_MS, prefersReducedMotion } from "@/lib/motion";

interface AnimatedNumberProps {
  value: number | null;
  format: (value: number) => string;
  revision: number;
}

export function AnimatedNumber({ value, format, revision }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const seenRevision = useRef(revision);

  useLayoutEffect(() => {
    const el = ref.current;
    const node = el?.firstChild;
    const from = shown.current;
    const byTick = seenRevision.current !== revision;
    seenRevision.current = revision;
    if (value === null) return;
    if (!el || !node || !byTick || from === null || from === value || prefersReducedMotion()) {
      shown.current = value;
      if (node) node.nodeValue = format(value);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / MOTION_MS);
      const v = t === 1 ? value : from + (value - from) * easeOut(t);
      shown.current = v;
      node.nodeValue = format(v);
      if (t < 1) frame = requestAnimationFrame(step);
      else delete el.dataset.changed;
    };
    if (format(from) !== format(value)) el.dataset.changed = "";
    node.nodeValue = format(from);
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      shown.current = value;
      delete el.dataset.changed;
    };
  }, [value, format, revision]);

  return (
    <span ref={ref} className="live-number">
      {value === null ? EMPTY_VALUE : format(value)}
    </span>
  );
}
