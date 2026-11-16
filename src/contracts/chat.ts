import { z } from "zod";
import { periodSchema } from "./dataset";

export const ANSWER_KINDS = ["normal", "low_confidence", "abstain", "error"] as const;
export const answerKindSchema = z.enum(ANSWER_KINDS);
export type AnswerKind = z.infer<typeof answerKindSchema>;

export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;
export const confidenceSchema = z.enum(CONFIDENCE_LEVELS);
export type Confidence = z.infer<typeof confidenceSchema>;

export const citationSchema = z.object({
  marketId: z.string().optional(),
  regionId: z.string().optional(),
  productId: z.string().optional(),
  period: periodSchema.optional(),
  label: z.string().optional(),
});
export type Citation = z.infer<typeof citationSchema>;

export const chatEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("token"), value: z.string() }),
  z.object({
    type: z.literal("done"),
    kind: answerKindSchema,
    citations: z.array(citationSchema),
    confidence: confidenceSchema,
  }),
  z.object({ type: z.literal("error"), message: z.string() }),
]);
export type ChatEvent = z.infer<typeof chatEventSchema>;
export type ChatDoneEvent = Extract<ChatEvent, { type: "done" }>;

export const chatContextSchema = z.object({
  regionId: z.string().nullable(),
  marketId: z.string().nullable(),
  productId: z.string().nullable(),
  period: periodSchema,
});
export type ChatContext = z.infer<typeof chatContextSchema>;

export const chatRequestSchema = z.object({
  question: z.string().trim().min(1, "Ask a question").max(500),
  context: chatContextSchema.optional(),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const fixtureSchema = z.object({
  id: z.string(),
  keywords: z.array(z.string()).optional(),
  kind: answerKindSchema,
  answer: z.object({ text: z.string(), citations: z.array(citationSchema), confidence: confidenceSchema }),
  error: z.string().optional(),
});
export type Fixture = z.infer<typeof fixtureSchema>;

export const fixturesFileSchema = z.object({ default: fixtureSchema, fixtures: z.array(fixtureSchema) });
