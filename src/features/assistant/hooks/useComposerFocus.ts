"use client";

import { useEffect, useRef } from "react";
import { useFocusRescue } from "@/hooks/useFocusRescue";

export function useComposerFocus(open: boolean, focusRequest: number, turnCount: number) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open && focusRequest === 0) return;
    if (open && !returnFocusTo.current && document.activeElement instanceof HTMLElement) {
      returnFocusTo.current = document.activeElement;
    }
    inputRef.current?.focus();
  }, [open, focusRequest]);

  useEffect(() => {
    if (open || !returnFocusTo.current) return;
    returnFocusTo.current.focus();
    returnFocusTo.current = null;
  }, [open]);

  useFocusRescue(turnCount, inputRef);
  return inputRef;
}
