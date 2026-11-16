import { alertRulePayloadSchema, SIMULATE_FAILURE_HEADER } from "@/contracts/alerts";
import { alertStore } from "@/server/alerts/store";
import { requirePermission, requireSession } from "@/server/auth/guard";
import { env } from "@/server/env";
import { jsonError, readJson, sleep } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return (await requireSession()) ?? Response.json(alertStore.list());
}

export async function POST(req: Request) {
  const denied = await requirePermission("alerts:write");
  if (denied) return denied;
  await sleep(env.ALERTS_LATENCY_MS);
  if (req.headers.get(SIMULATE_FAILURE_HEADER) === "1") {
    return jsonError(503, "Alerts service is temporarily unavailable. Your rule was not saved.");
  }
  const parsed = alertRulePayloadSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(422, "Invalid alert rule", parsed.error.issues);
  return Response.json(alertStore.create(parsed.data), { status: 201 });
}
