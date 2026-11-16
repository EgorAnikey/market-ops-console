"use client";

import { forwardRef, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp, Crosshair, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export const MAX_QUESTION_LENGTH = 500;

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (question: string) => void;
  onStop: () => void;
  streaming: boolean;
  contextLabel: string;
  includeContext: boolean;
  onToggleContext: (next: boolean) => void;
}

export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  { value, onChange, onSubmit, onStop, streaming, contextLabel, includeContext, onToggleContext },
  ref,
) {
  const trimmed = value.trim();
  const tooLong = value.length > MAX_QUESTION_LENGTH;
  const canSend = trimmed.length > 0 && !tooLong && !streaming;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (canSend) onSubmit(trimmed);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 border-t border-border p-3">
      <button
        type="button"
        aria-pressed={includeContext}
        onClick={() => onToggleContext(!includeContext)}
        className={cn(
          "touch-target",
          "inline-flex max-w-full items-center gap-1 self-start rounded-full border px-2 py-0.5 text-[0.6875rem]",
          includeContext
            ? "border-accent/40 bg-accent-soft text-accent"
            : "border-border text-fg-subtle line-through",
        )}
      >
        <Crosshair aria-hidden className="size-3 shrink-0" />
        <span className="truncate">Context: {contextLabel}</span>
      </button>
      <div className="flex items-end gap-2 rounded-lg border border-control-border bg-surface p-1.5 focus-within:border-focus focus-within:ring-2 focus-within:ring-focus/40">
        <label htmlFor="assistant-input" className="sr-only">
          Ask the assistant
        </label>
        <textarea
          ref={ref}
          id="assistant-input"
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about markets, regions, products…"
          aria-invalid={tooLong}
          aria-describedby="assistant-input-hint"
          className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-1.5 py-1 text-[0.8125rem] text-fg outline-none placeholder:text-fg-subtle"
        />
        {streaming ? (
          <Button variant="secondary" size="icon" onClick={onStop} aria-label="Stop generating">
            <Square aria-hidden className="size-3.5 fill-current" />
          </Button>
        ) : (
          <Button type="submit" variant="primary" size="icon" disabled={!canSend} aria-label="Send question">
            <ArrowUp aria-hidden className="size-4" />
          </Button>
        )}
      </div>
      <p
        id="assistant-input-hint"
        className={cn("text-[0.6875rem]", tooLong ? "text-bad" : "text-fg-subtle")}
      >
        {tooLong
          ? `Too long: ${value.length}/${MAX_QUESTION_LENGTH} characters.`
          : "Enter to send · Shift+Enter for a new line · AI answers can be wrong; check the sources."}
      </p>
    </form>
  );
});
