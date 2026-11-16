import { requireSession } from "@/server/auth/guard";
import { dataset } from "@/server/dataset";
import { env } from "@/server/env";
import { createLiveStream } from "@/server/live/stream";
import { SSE_HEADERS } from "@/server/sse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await requireSession();
  if (denied) return denied;
  return new Response(createLiveStream(dataset, env.LIVE_INTERVAL_MS, req.signal), { headers: SSE_HEADERS });
}
