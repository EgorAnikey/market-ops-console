"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/observability";

export function WebVitals() {
  useReportWebVitals((metric) => {
    trackEvent({ name: `web-vital.${metric.name}`, value: metric.value, detail: { rating: metric.rating } });
  });
  return null;
}
