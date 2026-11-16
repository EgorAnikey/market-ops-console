import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sseResponse } from "@/test/render";
import { useChat } from "../useChat";

afterEach(() => vi.unstubAllGlobals());

const lastAnswer = (turns: ReturnType<typeof useChat>["turns"]) => {
  const t = turns.at(-1);
  if (t?.role !== "assistant") throw new Error("expected an assistant turn");
  return t;
};

describe("useChat", () => {
  it("renders the contract's error event as a failed answer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => sseResponse([{ type: "error", message: "Upstream timed out" }])),
    );
    const { result } = renderHook(() => useChat());
    act(() => result.current.ask("force error", null));
    await waitFor(() =>
      expect(lastAnswer(result.current.turns)).toMatchObject({
        status: "error",
        error: "Upstream timed out",
      }),
    );
  });

  it("treats a stream that ends without `done` as interrupted, and malformed events as errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => sseResponse([{ type: "token", value: "Partial" }])),
    );
    const { result } = renderHook(() => useChat());
    act(() => result.current.ask("q", null));
    await waitFor(() => expect(lastAnswer(result.current.turns).status).toBe("error"));
    expect(lastAnswer(result.current.turns).text).toBe("Partial");

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => sseResponse([{ type: "surprise" }])),
    );
    act(() => result.current.ask("q2", null));
    await waitFor(() => expect(lastAnswer(result.current.turns).error).toMatch(/could not read/));
  });

  it("reports HTTP failures without crashing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 503 })),
    );
    const { result } = renderHook(() => useChat());
    act(() => result.current.ask("q", null));
    await waitFor(() => expect(lastAnswer(result.current.turns).error).toMatch(/unavailable \(503\)/));
  });
});
