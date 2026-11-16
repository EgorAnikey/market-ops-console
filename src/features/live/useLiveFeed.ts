"use client";

import { useEffect, useRef, useState } from "react";
import type { LiveTick } from "@/contracts/live";
import { HttpError } from "@/lib/http";
import { reportError } from "@/lib/observability";
import { streamLive } from "./stream-live";

export type LiveStatus = "off" | "connecting" | "live" | "reconnecting" | "signed-out";

export const RETRY_MS = 5000;

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => (clearTimeout(timer), resolve()), { once: true });
  });

export function useLiveFeed(enabled: boolean, onTick: (tick: LiveTick) => void): LiveStatus {
  const [status, setStatus] = useState<Exclude<LiveStatus, "off">>("connecting");
  const onTickRef = useRef(onTick);
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const { signal } = controller;

    void (async () => {
      while (!signal.aborted) {
        try {
          for await (const tick of streamLive(signal)) {
            setStatus("live");
            onTickRef.current(tick);
          }
        } catch (error) {
          if (error instanceof HttpError && (error.status === 401 || error.status === 403)) {
            setStatus("signed-out");
            return;
          }
          if (!signal.aborted) reportError(error, { feature: "live" });
        }
        if (signal.aborted) return;
        setStatus("reconnecting");
        await wait(RETRY_MS, signal);
      }
    })();

    return () => {
      controller.abort();
      setStatus("connecting");
    };
  }, [enabled]);

  return enabled ? status : "off";
}
