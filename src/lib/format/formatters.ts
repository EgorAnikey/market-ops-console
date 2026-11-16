import type { Period } from "@/contracts/dataset";
import type { MetricDef } from "@/domain/metrics";

export interface Formatters {
  locale: string;
  currency: (value: number) => string;
  compactCurrency: (value: number) => string;
  compact: (value: number) => string;
  integer: (value: number) => string;
  percent: (value: number | null) => string;
  signedPercent: (value: number | null) => string;
  period: (period: Period) => string;
  periodLong: (period: Period) => string;
  metric: (def: MetricDef, value: number | null) => string;
  time: (iso: string) => string;
}

export const EMPTY_VALUE = "—";

export function periodToDate(period: Period): Date {
  const [y, m] = period.split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, 1, 12));
}

export function createFormatters(locale: string, currency: string): Formatters {
  const currencyFmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const compactCurrencyFmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  const compactFmt = new Intl.NumberFormat(locale, {
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  const integerFmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const pctFmt = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });
  const signedPctFmt = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    signDisplay: "exceptZero",
  });
  const monthFmt = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" });
  const monthLongFmt = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const timeFmt = new Intl.DateTimeFormat(locale, { timeStyle: "medium" });

  const percent = (v: number | null) => (v === null ? EMPTY_VALUE : pctFmt.format(v / 100));
  const signedPercent = (v: number | null) => (v === null ? EMPTY_VALUE : signedPctFmt.format(v / 100));
  const compactCurrency = (v: number) => compactCurrencyFmt.format(v);

  return {
    locale,
    currency: (v) => currencyFmt.format(v),
    compactCurrency,
    compact: (v) => compactFmt.format(v),
    integer: (v) => integerFmt.format(v),
    percent,
    signedPercent,
    period: (p) => monthFmt.format(periodToDate(p)),
    periodLong: (p) => monthLongFmt.format(periodToDate(p)),
    metric: (def, value) => {
      if (value === null) return EMPTY_VALUE;
      if (def.format === "currency") return compactCurrency(value);
      return def.format === "signedPercent" ? signedPercent(value) : percent(value);
    },
    time: (iso) => timeFmt.format(new Date(iso)),
  };
}
