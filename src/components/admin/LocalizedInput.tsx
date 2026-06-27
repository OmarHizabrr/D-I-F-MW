"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { LocalizedString, LocaleCode } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const LOCALES: { code: LocaleCode; label: string }[] = [
  { code: "ar", label: "عربي" },
  { code: "en", label: "EN" },
  { code: "ny", label: "NY" },
];

export interface LocalizedInputProps {
  label?: string;
  value?: LocalizedString;
  onChange: (value: LocalizedString) => void;
  multiline?: boolean;
  placeholder?: string;
}

export function LocalizedInput({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: LocalizedInputProps) {
  const [activeLocale, setActiveLocale] = useState<LocaleCode>("ar");
  const current = value ?? emptyLocalized();

  function handleChange(locale: LocaleCode, text: string) {
    onChange({ ...current, [locale]: text });
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}

      <div className="flex gap-1 rounded-xl bg-border-subtle/50 p-1">
        {LOCALES.map((locale) => (
          <button
            key={locale.code}
            type="button"
            onClick={() => setActiveLocale(locale.code)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              activeLocale === locale.code
                ? "bg-brand-green text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {locale.label}
          </button>
        ))}
      </div>

      {multiline ? (
        <textarea
          value={current[activeLocale]}
          onChange={(e) => handleChange(activeLocale, e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={cn(
            "w-full rounded-2xl border border-border bg-input-bg px-4 py-3 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "transition-colors focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          )}
        />
      ) : (
        <Input
          value={current[activeLocale]}
          onChange={(e) => handleChange(activeLocale, e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
