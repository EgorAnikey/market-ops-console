"use client";

import { useMemo } from "react";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { createFormatters, type Formatters } from "@/lib/format/formatters";
import { useLocale } from "./LocaleProvider";

export function useFormatters(): Formatters {
  const { locale } = useLocale();
  const { currency } = useDatasetIndex();
  return useMemo(() => createFormatters(locale, currency), [locale, currency]);
}
