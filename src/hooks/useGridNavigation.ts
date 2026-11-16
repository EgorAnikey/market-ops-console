"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

export interface GridPos {
  row: number;
  col: number;
}

const clampTo = (rows: number, cols: number, p: GridPos): GridPos => ({
  row: Math.max(0, Math.min(rows - 1, p.row)),
  col: Math.max(0, Math.min(cols - 1, p.col)),
});

export function useGridNavigation(rows: number, cols: number, initial: GridPos) {
  const [stored, setPos] = useState<GridPos>(initial);
  const pos = clampTo(rows, cols, stored);
  const cells = useRef(new Map<string, HTMLElement>());
  const shouldFocus = useRef(false);

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    cells.current.get(`${pos.row}:${pos.col}`)?.focus();
  }, [pos.row, pos.col]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { row, col } = pos;
      const moves: Record<string, GridPos> = {
        ArrowRight: { row, col: col + 1 },
        ArrowLeft: { row, col: col - 1 },
        ArrowDown: { row: row + 1, col },
        ArrowUp: { row: row - 1, col },
        Home: e.ctrlKey ? { row: 0, col: 0 } : { row, col: 0 },
        End: e.ctrlKey ? { row: rows - 1, col: cols - 1 } : { row, col: cols - 1 },
      };
      const next = moves[e.key];
      if (!next) return;
      e.preventDefault();
      shouldFocus.current = true;
      setPos(clampTo(rows, cols, next));
    },
    [pos, rows, cols],
  );

  const cellProps = (row: number, col: number) => ({
    ref: (el: HTMLElement | null) => {
      const key = `${row}:${col}`;
      if (el) cells.current.set(key, el);
      else cells.current.delete(key);
    },
    tabIndex: row === pos.row && col === pos.col ? 0 : -1,
    onFocus: () => setPos((p) => (p.row === row && p.col === col ? p : { row, col })),
  });

  return { pos, onKeyDown, cellProps };
}
