import { chatEventSchema, type ChatEvent, type ChatRequest } from "@/contracts/chat";
import { streamSse } from "@/lib/sse/stream";

export function streamChat(request: ChatRequest, signal: AbortSignal): AsyncGenerator<ChatEvent> {
  return streamSse({
    url: "/api/chat",
    schema: chatEventSchema,
    init: { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) },
    signal,
    unavailable: (status) => `The assistant is unavailable (${status}).`,
    unreadable: "The assistant sent a response this console could not read.",
  });
}
