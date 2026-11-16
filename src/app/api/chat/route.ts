import { chatRequestSchema } from "@/contracts/chat";
import { createAnswerStream } from "@/server/chat/answer-stream";
import { pickFixture } from "@/server/chat/fixtures";
import { env } from "@/server/env";
import { jsonError, readJson } from "@/server/http";
import { SSE_HEADERS } from "@/server/sse";
import { requireSession } from "@/server/auth/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const denied = await requireSession();
  if (denied) return denied;
  const parsed = chatRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(400, "Invalid chat request", parsed.error.issues);

  const fixture = pickFixture(parsed.data.question, parsed.data.context);
  const stream = createAnswerStream(fixture, env.CHAT_TOKEN_DELAY_MS, req.signal);

  return new Response(stream, { headers: SSE_HEADERS });
}
