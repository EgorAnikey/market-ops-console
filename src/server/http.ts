import "server-only";
import type { z } from "zod";

export function jsonError(status: number, message: string, issues?: z.core.$ZodIssue[]): Response {
  return Response.json({ error: message, issues }, { status });
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

export async function readTextWithin(req: Request, maxBytes: number): Promise<string | null> {
  if (Number(req.headers.get("content-length") ?? 0) > maxBytes) return null;
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
    size += chunk.value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(chunk.value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
