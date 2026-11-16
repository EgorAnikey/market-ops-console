import { z } from "zod";
import { readTextWithin } from "@/server/http";

export const dynamic = "force-dynamic";

const MAX_BYTES = 4096;
const primitive = z.union([z.string().max(500), z.number(), z.boolean(), z.null()]);

const rumSchema = z.object({
  kind: z.enum(["event", "error"]),
  name: z.string().max(100).optional(),
  message: z.string().max(500).optional(),
  value: z.number().finite().optional(),
  detail: z.record(z.string().max(50), primitive).optional(),
  context: z.record(z.string().max(50), z.string().max(2000)).optional(),
  at: z.number(),
});

export async function POST(req: Request) {
  const text = await readTextWithin(req, MAX_BYTES);
  if (text === null) return new Response(null, { status: 413 });
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = rumSchema.safeParse(json);
  if (!parsed.success) return new Response(null, { status: 400 });
  console.info(JSON.stringify({ rum: parsed.data }));
  return new Response(null, { status: 204 });
}
