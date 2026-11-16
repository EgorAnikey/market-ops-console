"use client";

import { useState, type KeyboardEvent } from "react";

interface Options<T> {
  items: readonly T[];
  selectedIndex: number;
  onSelect: (item: T) => void;
  indexAt: (e: { clientX: number; clientY: number }) => number | null;
}

export function usePeriodScrubber<T>({ items, selectedIndex, onSelect, indexAt }: Options<T>) {
  const [hover, setHover] = useState<number | null>(null);
  const select = (i: number | null) => {
    const item = i === null ? undefined : items[Math.max(0, Math.min(items.length - 1, i))];
    if (item !== undefined) onSelect(item);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowLeft: selectedIndex - 1,
      ArrowRight: selectedIndex + 1,
      Home: 0,
      End: items.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select(keys[e.key]!);
  };

  return {
    hover,
    handlers: {
      onKeyDown,
      onPointerMove: (e: { clientX: number; clientY: number }) => setHover(indexAt(e)),
      onPointerLeave: () => setHover(null),
      onClick: (e: { clientX: number; clientY: number }) => select(indexAt(e)),
    },
  };
}
