"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import type { ChatContext } from "@/contracts/chat";
import { reportError, trackEvent } from "@/lib/observability";
import { chatReducer, type UserTurn } from "../lib/chat-state";
import { createFrameBuffer } from "../lib/frame-buffer";
import { streamChat } from "../lib/stream-chat";

const newId = () => crypto.randomUUID();
const INTERRUPTED = "The response ended before it finished. Nothing after this point was received.";

export function useChat() {
  const [turns, dispatch] = useReducer(chatReducer, []);
  const controllerRef = useRef<AbortController | null>(null);
  const turnsRef = useRef(turns);
  useEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  const run = useCallback(async (question: UserTurn) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const id = newId();
    const buffer = createFrameBuffer((text) => dispatch({ type: "append", id, text }));
    const startedAt = performance.now();
    let settled = false;
    dispatch({ type: "ask", question, answerId: id });

    try {
      const request = { question: question.text, ...(question.context ? { context: question.context } : {}) };
      for await (const event of streamChat(request, controller.signal)) {
        if (event.type === "token") {
          buffer.push(event.value);
          continue;
        }
        buffer.flush();
        settled = true;
        if (event.type === "done") {
          dispatch({ type: "done", id, event });
          trackEvent({
            name: "assistant.answer",
            value: performance.now() - startedAt,
            detail: { kind: event.kind },
          });
        } else {
          dispatch({ type: "fail", id, message: event.message });
        }
      }
      if (!settled) dispatch({ type: "fail", id, message: INTERRUPTED });
    } catch (error) {
      buffer.flush();
      if (controller.signal.aborted) {
        dispatch({ type: "stop", id });
      } else {
        reportError(error, { feature: "assistant" });
        dispatch({ type: "fail", id, message: error instanceof Error ? error.message : INTERRUPTED });
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }, []);

  const ask = useCallback(
    (text: string, context: ChatContext | null) =>
      void run({ role: "user", id: newId(), text: text.trim(), context }),
    [run],
  );

  const retry = useCallback(
    (questionId: string) => {
      const question = turnsRef.current.find((t): t is UserTurn => t.role === "user" && t.id === questionId);
      if (question) void run({ ...question, id: newId() });
    },
    [run],
  );

  const stop = useCallback(() => controllerRef.current?.abort(), []);
  const reset = useCallback(() => {
    controllerRef.current?.abort();
    dispatch({ type: "reset" });
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const isStreaming = turns.some((t) => t.role === "assistant" && t.status === "streaming");
  return { turns, ask, retry, stop, reset, isStreaming };
}

export type ChatApi = ReturnType<typeof useChat>;
