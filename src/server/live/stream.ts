import "server-only";
import type { Dataset } from "@/contracts/dataset";
import { encodeSse } from "@/server/sse";
import { liveTick } from "./simulate";

export function createLiveStream(dataset: Dataset, intervalMs: number, signal: AbortSignal) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const stop = () => {
        clearTimeout(timer);
        try {
          controller.close();
        } catch {}
      };
      const send = () => {
        if (signal.aborted) return stop();
        const now = Date.now();
        controller.enqueue(encodeSse(liveTick(dataset, Math.floor(now / intervalMs), new Date(now))));
        timer = setTimeout(send, intervalMs - (now % intervalMs));
      };
      signal.addEventListener("abort", stop, { once: true });
      send();
    },
    cancel() {
      clearTimeout(timer);
    },
  });
}
