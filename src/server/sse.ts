import "server-only";

const encoder = new TextEncoder();

export const encodeSse = (event: unknown): Uint8Array => encoder.encode(`data: ${JSON.stringify(event)}\n\n`);

export const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
} as const;
