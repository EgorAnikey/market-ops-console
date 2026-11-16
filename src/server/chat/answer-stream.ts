import "server-only";
import type { ChatEvent, Fixture } from "@/contracts/chat";
import { sleep } from "@/server/http";
import { encodeSse } from "@/server/sse";

const encode = (event: ChatEvent) => encodeSse(event);

export function tokenize(text: string): string[] {
  return text.match(/\s*\S+\s*/g) ?? [];
}

export function createAnswerStream(fixture: Fixture, tokenDelayMs: number, signal: AbortSignal) {
  let cancelled = signal.aborted;
  signal.addEventListener("abort", () => (cancelled = true), { once: true });

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const close = () => {
        try {
          controller.close();
        } catch {}
      };
      if (fixture.kind === "error") {
        controller.enqueue(encode({ type: "error", message: fixture.error ?? "Something went wrong." }));
        close();
        return;
      }
      for (const value of tokenize(fixture.answer.text)) {
        if (cancelled) return close();
        controller.enqueue(encode({ type: "token", value }));
        await sleep(tokenDelayMs);
      }
      if (cancelled) return close();
      const { citations, confidence } = fixture.answer;
      controller.enqueue(encode({ type: "done", kind: fixture.kind, citations, confidence }));
      close();
    },
    cancel() {
      cancelled = true;
    },
  });
}
