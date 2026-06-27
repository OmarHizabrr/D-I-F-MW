import ar from "./locales/ar";
import en from "./locales/en";
import ny from "./locales/ny";
import type { Locale } from "./types";

export const locales = { ar, en, ny } as const;

export const localeList: { code: Locale; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
  { code: "ny", label: "Chichewa" },
];

export function getTranslations(locale: Locale) {
  return locales[locale];
}

export type { Locale };
