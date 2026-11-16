import { z } from "zod";

export const periodSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Expected YYYY-MM");
export type Period = z.infer<typeof periodSchema>;

export const STATUSES = ["on_track", "at_risk", "off_track"] as const;
export const statusSchema = z.enum(STATUSES);
export type Status = z.infer<typeof statusSchema>;

export const anomalySchema = z.object({
  period: periodSchema,
  type: z.string(),
  note: z.string(),
});
export type Anomaly = z.infer<typeof anomalySchema>;

export const marketKpisSchema = z.object({
  revenue: z.number(),
  growthPct: z.number(),
  sharePct: z.number(),
  forecastAttainmentPct: z.number(),
  status: statusSchema,
  anomalies: z.array(anomalySchema),
});
export type MarketKpis = z.infer<typeof marketKpisSchema>;

export const regionSchema = z.object({ id: z.string(), name: z.string() });
export type Region = z.infer<typeof regionSchema>;

export const productSchema = z.object({ id: z.string(), name: z.string() });
export type Product = z.infer<typeof productSchema>;

export const marketSchema = z.object({
  id: z.string(),
  name: z.string(),
  iso3: z.string().length(3),
  iso2: z.string().length(2),
  regionId: z.string(),
  kpis: marketKpisSchema,
});
export type Market = z.infer<typeof marketSchema>;

export const seriesRowSchema = z.object({
  marketId: z.string(),
  productId: z.string(),
  period: periodSchema,
  actual: z.number(),
  forecast: z.number(),
  units: z.number(),
  priorYear: z.number(),
});
export type SeriesRow = z.infer<typeof seriesRowSchema>;

export const datasetSchema = z.object({
  meta: z.object({
    currency: z.string().length(3),
    periods: z.array(periodSchema).min(1),
    latestPeriod: periodSchema,
    generatedAt: z.string(),
  }),
  regions: z.array(regionSchema),
  products: z.array(productSchema),
  markets: z.array(marketSchema),
  series: z.array(seriesRowSchema),
});
export type Dataset = z.infer<typeof datasetSchema>;
