export const LOCALES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "de-DE", label: "Deutsch" },
  { value: "fr-FR", label: "Français" },
  { value: "ja-JP", label: "日本語" },
] as const;
export type Locale = (typeof LOCALES)[number]["value"];

export const DEFAULT_LOCALE: Locale = "en-US";
export const LOCALE_COOKIE = "mo.locale";

export function parseLocale(value: string | undefined | null): Locale {
  return LOCALES.find((l) => l.value === value)?.value ?? DEFAULT_LOCALE;
}
