import { z } from "zod";
import { marketKpisSchema, periodSchema } from "./dataset";

export const liveRowSchema = z.object({
  marketId: z.string(),
  productId: z.string(),
  actual: z.number(),
  units: z.number(),
});
export type LiveRow = z.infer<typeof liveRowSchema>;

export const liveMarketSchema = z.object({
  id: z.string(),
  kpis: marketKpisSchema.omit({ anomalies: true }),
});
export type LiveMarket = z.infer<typeof liveMarketSchema>;

export const liveTickSchema = z.object({
  type: z.literal("tick"),
  tick: z.number().int(),
  at: z.iso.datetime(),
  period: periodSchema,
  rows: z.array(liveRowSchema),
  markets: z.array(liveMarketSchema),
});
export type LiveTick = z.infer<typeof liveTickSchema>;
