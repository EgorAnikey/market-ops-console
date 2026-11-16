import { dataset } from "@/server/dataset";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    dataset: dataset.meta.generatedAt,
    uptimeSec: Math.round(process.uptime()),
  });
}
