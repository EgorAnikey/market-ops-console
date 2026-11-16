"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAssistantState } from "../AssistantProvider";

export function useDrawerModal(): boolean {
  const { open } = useAssistantState();
  const wide = useMediaQuery("(min-width: 1280px)", open);
  return open && !wide;
}
