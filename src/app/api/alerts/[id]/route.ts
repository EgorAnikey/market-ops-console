import { alertStore } from "@/server/alerts/store";
import { requirePermission } from "@/server/auth/guard";
import { env } from "@/server/env";
import { jsonError, sleep } from "@/server/http";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requirePermission("alerts:write");
  if (denied) return denied;
  const { id } = await ctx.params;
  await sleep(env.ALERTS_LATENCY_MS / 2);
  return alertStore.remove(id) ? new Response(null, { status: 204 }) : jsonError(404, "Alert rule not found");
}
