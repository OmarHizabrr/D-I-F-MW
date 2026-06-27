"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

export function ThemeToggle({ variant = "default" }: { variant?: "default" | "topbar" }) {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const options = [
    { value: "light", icon: Sun, label: t.theme.light },
    { value: "dark", icon: Moon, label: t.theme.dark },
    { value: "system", icon: Monitor, label: t.theme.system },
  ] as const;

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-2xl p-0.5",
        variant === "topbar" ? "bg-white/10" : "bg-border-subtle"
      )}
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          title={label}
          aria-label={label}
          className={cn(
            "rounded-xl p-1.5 transition-colors",
            theme === value
              ? variant === "topbar"
                ? "bg-white text-brand-green-dark"
                : "bg-surface text-brand-green shadow-sm"
              : variant === "topbar"
                ? "text-white/80 hover:bg-white/10"
                : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
