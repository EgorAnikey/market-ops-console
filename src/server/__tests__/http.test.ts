import { describe, expect, it } from "vitest";
import { readTextWithin } from "../http";

const streamed = (chunks: string[]) =>
  new Request("http://localhost/api/rum", {
    method: "POST",
    body: new ReadableStream<Uint8Array>({
      pull(controller) {
        const next = chunks.shift();
        if (next === undefined) controller.close();
        else controller.enqueue(new TextEncoder().encode(next));
      },
    }),
    duplex: "half",
  } as RequestInit);

describe("readTextWithin", () => {
  it("reads a body within the limit, and stops reading one that grows past it without a declared length", async () => {
    expect(await readTextWithin(streamed(['{"a":', "1}"]), 64)).toBe('{"a":1}');

    const chunks = ["x".repeat(40), "x".repeat(40), "x".repeat(40)];
    expect(await readTextWithin(streamed(chunks), 64)).toBeNull();
    expect(chunks).toHaveLength(1);
  });
});
