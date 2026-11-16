"use client";

import { useMemo } from "react";
import { CONFIDENCE_META } from "../components/ConfidenceMeter";
import type { Turn } from "../lib/chat-state";

export function useAnswerAnnouncement(turns: readonly Turn[]): string {
  return useMemo(() => {
    const last = turns.at(-1);
    if (!last || last.role !== "assistant") return "";
    switch (last.status) {
      case "streaming":
        return "Assistant is answering.";
      case "stopped":
        return "Generation stopped. The answer is incomplete.";
      case "error":
        return `The assistant could not answer. ${last.error ?? ""}`;
      case "done": {
        const confidence = last.confidence ? CONFIDENCE_META[last.confidence].label : "";
        const sources = `${last.citations.length} source${last.citations.length === 1 ? "" : "s"}`;
        return `Answer ready. ${confidence}. ${sources}.`;
      }
    }
  }, [turns]);
}
