import { describe, expect, it } from "vitest";
import { chatEventSchema, type ChatEvent } from "@/contracts/chat";
import { createSseParser } from "@/lib/sse/parser";
import { createAnswerStream } from "../answer-stream";
import { pickFixture } from "../fixtures";

async function collect(stream: ReadableStream<Uint8Array>): Promise<ChatEvent[]> {
  const parser = createSseParser();
  const decoder = new TextDecoder();
  const events: ChatEvent[] = [];
  for await (const chunk of stream) {
    for (const data of parser.push(decoder.decode(chunk, { stream: true }))) {
      events.push(chatEventSchema.parse(JSON.parse(data)));
    }
  }
  return events;
}

describe("pickFixture", () => {
  it("matches keywords case-insensitively, first match wins", () => {
    expect(pickFixture("Which markets are AT RISK this quarter?").id).toBe("at-risk");
    expect(pickFixture("Why did Germany's revenue dip?").id).toBe("germany-dip");
  });

  it("falls back to dashboard context, then to the default", () => {
    const context = { regionId: "eu", marketId: "de", productId: null, period: "2026-03" };
    expect(pickFixture("why did it dip?", context).id).toBe("germany-dip");
    expect(pickFixture("what is the meaning of life?").id).toBe("default");
  });
});

describe("createAnswerStream", () => {
  it("streams tokens that reconstruct the answer, then a done event", async () => {
    const fixture = pickFixture("germany");
    const events = await collect(createAnswerStream(fixture, 0, new AbortController().signal));
    const text = events.flatMap((e) => (e.type === "token" ? [e.value] : [])).join("");
    expect(text).toBe(fixture.answer.text);
    expect(events.at(-1)).toMatchObject({ type: "done", kind: "normal", confidence: "high" });
  });

  it("stops producing once the client aborts", async () => {
    const controller = new AbortController();
    controller.abort();
    const events = await collect(createAnswerStream(pickFixture("summary"), 0, controller.signal));
    expect(events).toHaveLength(0);
  });
});
