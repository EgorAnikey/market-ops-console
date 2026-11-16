"use client";

import { useState } from "react";
import { Eraser, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { cn } from "@/lib/cn";
import { useAssistantActions, useAssistantState } from "../AssistantProvider";
import { useAnswerAnnouncement } from "../hooks/useAnswerAnnouncement";
import { useChatContext } from "../hooks/useChatContext";
import { useComposerFocus } from "../hooks/useComposerFocus";
import { useDrawerModal } from "../hooks/useDrawerModal";
import { Composer } from "./Composer";
import { ConversationLog } from "./ConversationLog";

export function AssistantPanel() {
  const { turns, isStreaming, open, draft, focusRequest } = useAssistantState();
  const { ask, retry, stop, reset, setOpen, setDraft } = useAssistantActions();
  const { context, label } = useChatContext();
  const [withContext, setWithContext] = useState(true);
  const announcement = useAnswerAnnouncement(turns);
  const inputRef = useComposerFocus(open, focusRequest, turns.length);
  const modal = useDrawerModal();

  const submit = (question: string) => {
    ask(question, withContext ? context : null);
    setDraft("");
  };

  return (
    <>
      {open ? (
        <div
          aria-hidden
          className="fixed inset-0 z-30 bg-black/30 xl:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div
        id="assistant"
        aria-labelledby="assistant-title"
        role={modal ? "dialog" : "complementary"}
        aria-modal={modal || undefined}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-pop transition-transform",
          "xl:sticky xl:top-0 xl:z-0 xl:h-dvh xl:max-w-none xl:translate-x-0 xl:shadow-none",
          open ? "translate-x-0" : "max-xl:hidden",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
          <h2 id="assistant-title" className="flex items-center gap-1.5 text-sm font-semibold">
            <Sparkles aria-hidden className="size-4 text-ai" /> Assistant
            <span className="rounded bg-ai-soft px-1.5 text-[0.625rem] font-semibold text-ai uppercase">
              AI
            </span>
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={reset}
              disabled={turns.length === 0}
              aria-label="Clear conversation"
            >
              <Eraser aria-hidden className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="xl:hidden"
            >
              <X aria-hidden className="size-4" />
            </Button>
          </div>
        </div>
        <ErrorBoundary name="Conversation">
          <ConversationLog turns={turns} onRetry={retry} onPick={submit} />
        </ErrorBoundary>
        <p role="status" className="sr-only">
          {announcement}
        </p>
        <Composer
          ref={inputRef}
          value={draft}
          onChange={setDraft}
          onSubmit={submit}
          onStop={stop}
          streaming={isStreaming}
          contextLabel={label}
          includeContext={withContext}
          onToggleContext={setWithContext}
        />
      </div>
    </>
  );
}
