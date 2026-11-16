"use client";

import { Select } from "@/components/ui/Select";
import { useLocale } from "@/features/locale/LocaleProvider";
import { LOCALES, type Locale } from "@/features/locale/locales";

const OPTIONS = LOCALES.map((l) => ({ value: l.value, label: l.label, lang: l.value }));

export function LocaleSelect() {
  const { locale, setLocale } = useLocale();
  return (
    <Select<Locale>
      aria-label="Number and date format"
      value={locale}
      onChange={setLocale}
      options={OPTIONS}
    />
  );
}
