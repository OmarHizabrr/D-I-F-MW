"use client";

import { Phone, Mail, Share2, MessageCircle, Play, Camera } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { localeList } from "@/i18n";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";

const socialLinks = [
  { icon: Share2, href: "#", label: "Facebook" },
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: Play, href: "#", label: "YouTube" },
  { icon: Camera, href: "#", label: "Instagram" },
];

export function TopBar() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="safe-top bg-topbar-bg text-topbar-fg">
      <div className="container-dif flex flex-col gap-2 py-2 text-xs sm:gap-3 sm:text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none sm:gap-4">
          <a
            href={`tel:${t.topBar.phone}`}
            className="flex shrink-0 items-center gap-1.5 hover:opacity-80 active:opacity-70"
          >
            <Phone className="h-4 w-4" />
            <span dir="ltr" className="whitespace-nowrap">{t.topBar.phone}</span>
          </a>
          <a
            href={`mailto:${t.topBar.email}`}
            className="flex shrink-0 items-center gap-1.5 hover:opacity-80 active:opacity-70"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden min-[400px]:inline">{t.topBar.email}</span>
          </a>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="touch-target rounded-xl p-2 transition-colors hover:bg-white/10 active:bg-white/20"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-0.5 rounded-2xl bg-white/10 p-0.5">
              {localeList.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`touch-target-sm rounded-xl px-1.5 py-1 text-[10px] font-medium transition-colors sm:px-2 sm:text-xs ${
                    locale === code ? "bg-white text-brand-green-dark" : "hover:bg-white/10"
                  }`}
                >
                  {code === "ny" ? "NY" : label.slice(0, 2).toUpperCase()}
                </button>
              ))}
            </div>

            <ThemeToggle variant="topbar" />

            <Button
              variant="secondary"
              size="sm"
              className="!h-9 shrink-0 !border-white/30 !bg-white/10 !px-2.5 !text-[11px] !text-white hover:!bg-white/20 sm:!px-3.5 sm:!text-xs"
            >
              <span className="hidden sm:inline">{t.topBar.donorPortal}</span>
              <span className="sm:hidden">{t.topBar.login}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
