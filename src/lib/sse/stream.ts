import type { z } from "zod";
import { HttpError } from "@/lib/http";
import { createSseParser } from "./parser";

export class SseProtocolError extends Error {
  override name = "SseProtocolError";
}

interface StreamSseOptions<S extends z.ZodType> {
  url: string;
  schema: S;
  init?: RequestInit;
  signal: AbortSignal;
  unavailable: (status: number) => string;
  unreadable: string;
}

export async function* streamSse<S extends z.ZodType>(
  options: StreamSseOptions<S>,
): AsyncGenerator<z.infer<S>> {
  const { url, schema, init, signal, unavailable, unreadable } = options;
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "text/event-stream", ...init?.headers },
    signal,
  });
  if (!res.ok || !res.body) throw new HttpError(res.status, unavailable(res.status));

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  const parser = createSseParser();
  const parse = (data: string): z.infer<S> => {
    try {
      return schema.parse(JSON.parse(data));
    } catch {
      throw new SseProtocolError(unreadable);
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      const payloads = done ? parser.flush() : parser.push(value);
      for (const data of payloads) yield parse(data);
      if (done) return;
    }
  } finally {
    reader.releaseLock();
  }
}
