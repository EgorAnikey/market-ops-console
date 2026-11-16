"use client";

import dynamic from "next/dynamic";
import { useCommandPalette, useCommandPaletteHotkey } from "./useCommandPalette";

const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), {
  ssr: false,
});

export function CommandPaletteHost() {
  useCommandPaletteHotkey();
  const { open } = useCommandPalette();
  return open ? <CommandPalette /> : null;
}
