"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

const navKeys = [
  "home",
  "about",
  "projects",
  "programs",
  "achievements",
  "news",
  "reports",
  "media",
  "contact",
] as const;

export function Navigation() {
  const { t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-nav-bg/95 text-nav-fg backdrop-blur-md">
      <div className="container-dif flex h-14 items-center justify-between gap-3 sm:h-16 md:h-[4.5rem]">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <Image
            src="/Image/login.png"
            alt="D.I.F Logo"
            width={48}
            height={48}
            className="h-9 w-9 shrink-0 rounded-full sm:h-10 sm:w-10 md:h-12 md:w-12"
          />
          <div className="min-w-0 truncate">
            <p className="truncate text-xs font-bold leading-tight text-brand-green-dark dark:text-brand-green sm:text-sm">
              {t.locale === "ar" ? "مؤسسة التطوير والتنمية" : "D.I.F"}
            </p>
            <p className="hidden truncate text-[10px] text-muted-foreground min-[480px]:block">
              Development & Investment Foundation
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={`#${key}`}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-brand-green/10 hover:text-brand-green-dark dark:hover:text-brand-green"
            >
              {t.nav[key]}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="touch-target rounded-lg p-2 xl:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile overlay menu */}
      <div
        className={cn(
          "fixed inset-0 top-14 z-30 bg-black/40 transition-opacity xl:hidden sm:top-16",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      <div
        className={cn(
          "fixed inset-x-0 top-14 z-40 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-border-subtle bg-nav-bg shadow-lg transition-transform duration-300 xl:hidden sm:top-16",
          mobileOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        )}
      >
        <nav className="container-dif flex flex-col gap-0.5 py-3 pb-safe">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={`#${key}`}
              onClick={() => setMobileOpen(false)}
              className="touch-target rounded-xl px-4 py-3.5 text-base font-medium transition-colors active:bg-brand-green/10 hover:bg-brand-green/10"
            >
              {t.nav[key]}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
