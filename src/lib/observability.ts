export interface TelemetryEvent {
  name: string;
  value?: number;
  detail?: Record<string, string | number | boolean | null>;
}

const RUM_ENDPOINT = "/api/rum";

function beacon(payload: unknown): void {
  if (typeof navigator === "undefined") return;
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon?.(RUM_ENDPOINT, body)) return;
  void fetch(RUM_ENDPOINT, { method: "POST", body, keepalive: true }).catch(() => undefined);
}

export function trackEvent(event: TelemetryEvent): void {
  beacon({ kind: "event", ...event, at: Date.now() });
}

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

export function reportError(error: unknown, context: Record<string, string> = {}): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[market-ops]", message, context);
  const safeContext = Object.fromEntries(
    Object.entries(context).map(([k, v]) => [clip(k, 50), clip(v, 1500)]),
  );
  beacon({ kind: "error", message: clip(message, 500), context: safeContext, at: Date.now() });
}
