"use client";

import { useCallback, useRef } from "react";

type PointerLike = Pick<MouseEvent, "clientX" | "clientY">;

export function useViewBoxPointer(width: number, height: number) {
  const ref = useRef<SVGSVGElement>(null);
  const toViewBox = useCallback(
    (e: PointerLike) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return null;
      return {
        x: ((e.clientX - rect.left) / rect.width) * width,
        y: ((e.clientY - rect.top) / rect.height) * height,
      };
    },
    [width, height],
  );
  return { ref, toViewBox };
}
