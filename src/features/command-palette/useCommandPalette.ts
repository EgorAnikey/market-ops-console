"use client";

import { useEffect, useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();
const setOpen = (next: boolean) => {
  open = next;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useCommandPalette() {
  const isOpen = useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  );
  return { open: isOpen, setOpen };
}

export function useCommandPaletteHotkey() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
