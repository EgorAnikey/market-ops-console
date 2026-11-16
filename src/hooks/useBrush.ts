"use client";

import { useState, type PointerEvent } from "react";

export interface BrushRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

type ToViewBox = (e: { clientX: number; clientY: number }) => { x: number; y: number } | null;

const MIN_DRAG = 4;

export function useBrush(toViewBox: ToViewBox, onEnd: (rect: BrushRect | null) => void) {
  const [rect, setRect] = useState<BrushRect | null>(null);

  const onPointerDown = (e: PointerEvent<SVGElement>) => {
    const p = toViewBox(e);
    if (!p || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setRect({ x0: p.x, y0: p.y, x1: p.x, y1: p.y });
  };

  const onPointerMove = (e: PointerEvent<SVGElement>) => {
    const p = rect && toViewBox(e);
    if (rect && p) setRect({ ...rect, x1: p.x, y1: p.y });
  };

  const onPointerUp = () => {
    if (!rect) return;
    const norm = {
      x0: Math.min(rect.x0, rect.x1),
      x1: Math.max(rect.x0, rect.x1),
      y0: Math.min(rect.y0, rect.y1),
      y1: Math.max(rect.y0, rect.y1),
    };
    setRect(null);
    onEnd(norm.x1 - norm.x0 < MIN_DRAG && norm.y1 - norm.y0 < MIN_DRAG ? null : norm);
  };

  const onPointerCancel = () => setRect(null);

  return { rect, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel } };
}

export const inRect = (r: BrushRect, x: number, y: number) =>
  x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;
