"use client";

import { useCallback } from "react";
import type { ChatContext } from "@/contracts/chat";
import { scopeLabel } from "@/domain/hierarchy";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useFormatters } from "@/features/locale/useFormatters";
import { useStickToBottom } from "../hooks/useStickToBottom";
import type { Turn } from "../lib/chat-state";
import { AnswerCard } from "./AnswerCard";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { UserBubble } from "./UserBubble";

interface ConversationLogProps {
  turns: readonly Turn[];
  onRetry: (questionId: string) => void;
  onPick: (question: string) => void;
}

export function ConversationLog({ turns, onRetry, onPick }: ConversationLogProps) {
  const index = useDatasetIndex();
  const fmt = useFormatters();
  const last = turns.at(-1);
  const lastText = last?.role === "assistant" ? last.text : "";
  const scrollRef = useStickToBottom<HTMLDivElement>(`${turns.length}:${lastText.length}`);

  const contextLabel = useCallback(
    (ctx: ChatContext | null) => (ctx ? `${scopeLabel(index, ctx)} · ${fmt.period(ctx.period)}` : null),
    [index, fmt],
  );

  return (
    <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto p-3" tabIndex={-1}>
      {turns.length === 0 ? (
        <SuggestedQuestions onPick={onPick} />
      ) : (
        <div role="log" aria-live="off" aria-label="Conversation" className="flex flex-col gap-3">
          {turns.map((turn) =>
            turn.role === "user" ? (
              <UserBubble key={turn.id} turn={turn} contextLabel={contextLabel(turn.context)} />
            ) : (
              <AnswerCard key={turn.id} turn={turn} onRetry={onRetry} />
            ),
          )}
        </div>
      )}
    </div>
  );
}
