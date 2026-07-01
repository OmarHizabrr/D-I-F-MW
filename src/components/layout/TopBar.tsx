"use client";

import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { useSiteContent } from "@/context/SiteContentContext";
import { useDonation } from "@/context/DonationContext";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { getSocialPlatformIcon } from "@/lib/social-platform-icons";
import { localeList } from "@/i18n";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  const { locale, setLocale } = useLocale();
  const { topbar, donation, text } = useSiteContent();
  const { openDonation } = useDonation();
  const { portalEnabled } = useSystemSettings();

  const socialLinks = topbar.socialLinks
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="safe-top w-full overflow-hidden bg-topbar-bg text-topbar-fg">
      <div className="container-dif min-w-0 py-2 text-xs sm:text-sm">
        <div className="flex min-w-0 items-center gap-3 overflow-hidden sm:gap-4">
          <a
            href={`tel:${topbar.phone}`}
            className="flex shrink-0 items-center gap-1.5 hover:opacity-80 active:opacity-70"
          >
            <Phone className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span dir="ltr" className="whitespace-nowrap text-[11px] sm:text-sm">
              {topbar.phone}
            </span>
          </a>
          <a
            href={`mailto:${topbar.email}`}
            className="flex min-w-0 items-center gap-1.5 truncate hover:opacity-80 active:opacity-70"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="hidden truncate min-[380px]:inline">{topbar.email}</span>
          </a>
        </div>

        <div className="mt-2 flex min-w-0 items-center justify-between gap-2">
          <div className="hidden items-center gap-0.5 sm:flex">
            {socialLinks.map((link) => {
              const Icon = getSocialPlatformIcon(link.platform);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  aria-label={link.platform}
                  className="rounded-xl p-2 transition-colors hover:bg-white/10 active:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2 sm:flex-none">
            <div className="flex shrink-0 items-center gap-0.5 rounded-2xl bg-white/10 p-0.5">
              {localeList.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`rounded-xl px-2 py-1 text-[10px] font-medium transition-colors sm:text-xs ${
                    locale === code ? "bg-white text-brand-green-dark" : "hover:bg-white/10"
                  }`}
                >
                  {code === "ny" ? "NY" : label.slice(0, 2).toUpperCase()}
                </button>
              ))}
            </div>

            <ThemeToggle variant="topbar" />

            {donation.enabled && (
              <button
                type="button"
                onClick={() => openDonation()}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-brand-brown px-2 text-[10px] font-semibold text-white transition-colors hover:bg-brand-brown-light sm:h-9 sm:px-3 sm:text-xs"
              >
                <span className="hidden sm:inline">{text(donation.navButtonLabel)}</span>
                <span className="sm:hidden">{text(donation.navButtonLabel)}</span>
              </button>
            )}

            {portalEnabled && (
              <Link
                href="/portal"
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-2 text-[10px] font-semibold text-white transition-colors hover:bg-white/20 sm:h-9 sm:px-3 sm:text-xs"
              >
                <span className="hidden sm:inline">{text(topbar.donorPortalLabel)}</span>
                <span className="sm:hidden">{text(topbar.loginLabel)}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
