"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Turn } from "./lib/chat-state";
import { useChat } from "./hooks/useChat";

interface AssistantState {
  turns: readonly Turn[];
  isStreaming: boolean;
  open: boolean;
  draft: string;
  focusRequest: number;
}

interface AssistantActions {
  ask: ReturnType<typeof useChat>["ask"];
  retry: (questionId: string) => void;
  stop: () => void;
  reset: () => void;
  setOpen: (open: boolean) => void;
  setDraft: (text: string) => void;
  prefill: (text: string) => void;
  focusComposer: () => void;
}

const StateContext = createContext<AssistantState | null>(null);
const ActionsContext = createContext<AssistantActions | null>(null);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const { turns, isStreaming, ask, retry, stop, reset } = useChat();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [focusRequest, setFocusRequest] = useState(0);

  const prefill = useCallback((text: string) => {
    setDraft(text);
    setOpen(true);
    setFocusRequest((n) => n + 1);
  }, []);

  const focusComposer = useCallback(() => {
    setOpen(true);
    setFocusRequest((n) => n + 1);
  }, []);

  const actions = useMemo(
    () => ({ ask, retry, stop, reset, setOpen, setDraft, prefill, focusComposer }),
    [ask, retry, stop, reset, prefill, focusComposer],
  );
  const state = useMemo(
    () => ({ turns, isStreaming, open, draft, focusRequest }),
    [turns, isStreaming, open, draft, focusRequest],
  );

  return (
    <ActionsContext value={actions}>
      <StateContext value={state}>{children}</StateContext>
    </ActionsContext>
  );
}

function useRequired<T>(ctx: T | null, name: string): T {
  if (!ctx) throw new Error(`${name} must be used inside <AssistantProvider>`);
  return ctx;
}

export const useAssistantState = () => useRequired(useContext(StateContext), "useAssistantState");
export const useAssistantActions = () => useRequired(useContext(ActionsContext), "useAssistantActions");
