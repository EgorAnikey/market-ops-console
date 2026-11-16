import "server-only";
import { z } from "zod";

const envSchema = z.object({
  CHAT_TOKEN_DELAY_MS: z.coerce.number().int().min(0).max(1000).default(35),
  ALERTS_LATENCY_MS: z.coerce.number().int().min(0).max(10_000).default(600),
  LIVE_INTERVAL_MS: z.coerce.number().int().min(250).max(60_000).default(3000),
});

export const env = envSchema.parse(process.env);
