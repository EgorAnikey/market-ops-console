"use client";

import { useEffect, useMemo, useState } from "react";
import { easeOut, MOTION_MS, prefersReducedMotion } from "@/lib/motion";

interface Tween {
  from: readonly number[];
  to: readonly number[];
  progress: number;
}

const same = (a: readonly number[], b: readonly number[]) =>
  a.length === b.length && a.every((v, i) => Object.is(v, b[i]));

const mix = ({ from, to, progress }: Tween): number[] => {
  const k = easeOut(progress);
  return to.map((v, i) => (from[i] ?? v) + (v - (from[i] ?? v)) * k);
};

export function useTweenedNumbers(target: readonly number[], revision: number): readonly number[] {
  const [seen, setSeen] = useState({ values: target, revision });
  const [tween, setTween] = useState<Tween | null>(null);

  if (seen.revision !== revision || !same(seen.values, target)) {
    setSeen({ values: target, revision });
    if (!same(seen.values, target)) {
      const byTick =
        revision !== seen.revision && seen.values.length === target.length && !prefersReducedMotion();
      setTween(byTick ? { from: tween ? mix(tween) : seen.values, to: target, progress: 0 } : null);
    }
  }

  const to = tween?.to;
  useEffect(() => {
    if (!to) return;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / MOTION_MS);
      setTween((t) => (t?.to !== to ? t : progress < 1 ? { ...t, progress } : null));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [to]);

  return tween ? mix(tween) : target;
}

export function useTweenedNullable(
  target: readonly (number | null)[],
  revision: number,
): readonly (number | null)[] {
  const numbers = useMemo(() => target.map((v) => v ?? Number.NaN), [target]);
  const tweened = useTweenedNumbers(numbers, revision);
  return useMemo(() => tweened.map((v) => (Number.isNaN(v) ? null : v)), [tweened]);
}
