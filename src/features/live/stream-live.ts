import { liveTickSchema, type LiveTick } from "@/contracts/live";
import { streamSse } from "@/lib/sse/stream";

export function streamLive(signal: AbortSignal): AsyncGenerator<LiveTick> {
  return streamSse({
    url: "/api/live",
    schema: liveTickSchema,
    signal,
    unavailable: (status) => `Live updates are unavailable (${status}).`,
    unreadable: "Live updates sent data this console could not read.",
  });
}
