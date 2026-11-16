import type { AnswerKind, ChatContext, ChatDoneEvent, Citation, Confidence } from "@/contracts/chat";

export type AnswerStatus = "streaming" | "done" | "stopped" | "error";

export interface UserTurn {
  role: "user";
  id: string;
  text: string;
  context: ChatContext | null;
}

export interface AssistantTurn {
  role: "assistant";
  id: string;
  questionId: string;
  text: string;
  status: AnswerStatus;
  kind: AnswerKind | null;
  confidence: Confidence | null;
  citations: Citation[];
  error: string | null;
}

export type Turn = UserTurn | AssistantTurn;

export type ChatAction =
  | { type: "ask"; question: UserTurn; answerId: string }
  | { type: "append"; id: string; text: string }
  | { type: "done"; id: string; event: ChatDoneEvent }
  | { type: "fail"; id: string; message: string }
  | { type: "stop"; id: string }
  | { type: "reset" };

const patch = (turns: Turn[], id: string, fn: (t: AssistantTurn) => AssistantTurn): Turn[] =>
  turns.map((t) => (t.role === "assistant" && t.id === id ? fn(t) : t));

export function chatReducer(turns: Turn[], action: ChatAction): Turn[] {
  switch (action.type) {
    case "ask":
      return [
        ...turns,
        action.question,
        {
          role: "assistant",
          id: action.answerId,
          questionId: action.question.id,
          text: "",
          status: "streaming",
          kind: null,
          confidence: null,
          citations: [],
          error: null,
        },
      ];
    case "append":
      return patch(turns, action.id, (t) => ({ ...t, text: t.text + action.text }));
    case "done":
      return patch(turns, action.id, (t) => ({
        ...t,
        status: action.event.kind === "error" ? "error" : "done",
        kind: action.event.kind,
        confidence: action.event.confidence,
        citations: action.event.citations,
      }));
    case "fail":
      return patch(turns, action.id, (t) => ({
        ...t,
        status: "error",
        kind: "error",
        error: action.message,
      }));
    case "stop":
      return patch(turns, action.id, (t) => (t.status === "streaming" ? { ...t, status: "stopped" } : t));
    case "reset":
      return [];
  }
}
