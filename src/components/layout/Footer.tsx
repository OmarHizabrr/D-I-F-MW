"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Home, ArrowUpRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";
import {
  buildFooterLinkGroups,
  footerUsesGroupedLinks,
  navChildLabel,
  type NavLabels,
} from "@/lib/nav-utils";
import { getSocialPlatformIcon } from "@/lib/social-platform-icons";
import { DonateButton } from "@/components/donation/DonateButton";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import type { LocaleCode } from "@/types/cms";

function FooterSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 text-sm font-bold tracking-wide text-white sm:text-base">{children}</h3>
  );
}

function FooterNavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-white/75 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  const { locale, t } = useLocale();
  const { footer, topbar, navItems, programs, sectionTitles, text } = useSiteContent();
  const { portalEnabled } = useSystemSettings();

  const navLabels: NavLabels = {
    aboutOverview: sectionTitles.navAboutOverview,
    team: sectionTitles.navTeam,
    faq: sectionTitles.navFaq,
    ourWork: sectionTitles.navOurWork,
    allProjects: sectionTitles.navAllProjects,
    successStories: sectionTitles.navSuccessStories,
    stories: sectionTitles.navStories,
    news: sectionTitles.navNews,
    events: sectionTitles.navEvents,
    media: sectionTitles.navMedia,
    volunteer: sectionTitles.navVolunteer,
    contact: sectionTitles.navContact,
    shareStory: sectionTitles.navShareStory,
    resources: sectionTitles.navResources,
    transparency: sectionTitles.navTransparency,
    zakatCalculator: sectionTitles.navZakatCalculator,
    waysToGive: sectionTitles.navWaysToGive,
    privacy: sectionTitles.navPrivacy,
  };

  const grouped = footerUsesGroupedLinks(footer.quickLinkIds);
  const linkGroups = grouped
    ? buildFooterLinkGroups(navItems, programs, navLabels, footer.quickLinkIds)
    : [];

  const flatLinks = navItems
    .filter((n) => n.enabled && footer.quickLinkIds.includes(n.id))
    .sort((a, b) => a.order - b.order);

  const homeNav = navItems.find((n) => n.id === "home" && n.enabled);
  const showHomeLink = footer.showHomeLink !== false && !!homeNav;

  const socialLinks = topbar.socialLinks
    .filter((s) => s.enabled && s.url && s.url !== "#")
    .sort((a, b) => a.order - b.order);

  const orgTitle = locale === "ar" ? t.footer.orgNameAr : t.footer.orgNameEn;

  function renderQuickLinks() {
    if (grouped && linkGroups.length > 0) {
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          {linkGroups.map((group) => (
            <div key={group.id} className="min-w-0 border-s-2 border-white/15 ps-4">
              <p className="mb-2 text-sm font-semibold text-white">{text(group.title)}</p>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <FooterNavLink href={link.href}>
                      {navChildLabel(link, locale as LocaleCode)}
                    </FooterNavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }

    if (flatLinks.length === 0 && !showHomeLink) {
      return <p className="text-sm text-white/60">—</p>;
    }

    return (
      <ul className="columns-1 gap-x-6 space-y-2 sm:columns-2">
        {showHomeLink && homeNav && (
          <li className="break-inside-avoid">
            <FooterNavLink href={homeNav.href}>{text(homeNav.label)}</FooterNavLink>
          </li>
        )}
        {flatLinks
          .filter((item) => item.id !== "home")
          .map((item) => (
            <li key={item.id} className="break-inside-avoid">
              <FooterNavLink href={item.href}>{text(item.label)}</FooterNavLink>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <footer className="safe-bottom border-t border-brand-green/30 bg-brand-green-dark text-white">
      <div className="container-dif px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* العلامة والدعوة للعمل */}
          <div className="lg:col-span-4 xl:col-span-4">
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <Image
                src="/Image/login.png"
                alt={orgTitle}
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full border-2 border-white/20 bg-white p-0.5"
              />
              <div className="min-w-0">
                <p className="text-base font-bold leading-tight">{orgTitle}</p>
                <p className="mt-0.5 text-xs text-white/65">{t.footer.orgTagline}</p>
              </div>
            </Link>
            <p className="mb-5 max-w-md text-sm leading-relaxed text-white/80">
              {text(footer.description)}
            </p>
            <div className="flex flex-wrap gap-2">
              <DonateButton variant="primary" size="sm" />
              {portalEnabled && (
                <Link
                  href="/portal"
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  {t.topBar.donorPortal}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
                </Link>
              )}
            </div>
          </div>

          {/* روابط الموقع */}
          <div className="lg:col-span-5 xl:col-span-5">
            <FooterSectionTitle>{text(sectionTitles.footerQuickLinks)}</FooterSectionTitle>
            {showHomeLink && homeNav && grouped && linkGroups.length > 0 && (
              <Link
                href={homeNav.href}
                className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                <Home className="h-4 w-4 shrink-0" />
                {text(homeNav.label)}
              </Link>
            )}
            {renderQuickLinks()}
          </div>

          {/* التواصل */}
          <div className="space-y-8 lg:col-span-3 xl:col-span-3">
            <div>
              <FooterSectionTitle>{text(sectionTitles.footerContactInfo)}</FooterSectionTitle>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                  <span className="text-white/80">
                    {text(footer.address)}
                    {footer.mapsUrl && (
                      <>
                        {" "}
                        <a
                          href={footer.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 font-medium text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
                        >
                          {text(sectionTitles.contactMapsLink)}
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </>
                    )}
                  </span>
                </li>
                {topbar.phone && (
                  <li>
                    <a
                      href={`tel:${topbar.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-white/70" />
                      <span dir="ltr">{topbar.phone}</span>
                    </a>
                  </li>
                )}
                {topbar.email && (
                  <li>
                    <a
                      href={`mailto:${topbar.email}`}
                      className="flex items-center gap-3 break-all text-white/80 transition-colors hover:text-white"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-white/70" />
                      <span dir="ltr">{topbar.email}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <FooterSectionTitle>{text(sectionTitles.footerWorkingHours)}</FooterSectionTitle>
              <p className="flex items-start gap-3 text-sm text-white/80">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                {text(footer.workingHours)}
              </p>
            </div>

            {socialLinks.length > 0 && (
              <div>
                <FooterSectionTitle>{t.footer.followUs}</FooterSectionTitle>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => {
                    const Icon = getSocialPlatformIcon(link.platform);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label={link.platform}
                        title={link.platform}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-center text-xs text-white/65 sm:flex-row sm:text-start sm:text-sm">
          <p>{text(footer.rights)}</p>
          <Link
            href="/privacy"
            className="font-medium text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            {text(sectionTitles.privacyPageTitle)}
          </Link>
        </div>
      </div>
    </footer>
  );
}

/** معاينة التذييل في لوحة الإدارة */
export type FooterPreviewProps = {
  description: string;
  address: string;
  workingHours: string;
  rights: string;
  quickLinkGroups: { title: string; links: { label: string; href: string }[] }[];
  showHome?: boolean;
  homeLabel?: string;
};

export function FooterPreview({
  description,
  address,
  workingHours,
  rights,
  quickLinkGroups,
  showHome,
  homeLabel,
}: FooterPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-brand-green-dark text-white">
      <div className="p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/50">معاينة التذييل</p>
        <p className="mb-4 text-sm leading-relaxed text-white/80">{description || "—"}</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold text-white">روابط</p>
            {showHome && homeLabel && (
              <p className="mb-2 text-xs text-white/75">⌂ {homeLabel}</p>
            )}
            {quickLinkGroups.map((group) => (
              <div key={group.title} className="mb-3 border-s-2 border-white/15 ps-3">
                <p className="text-xs font-semibold">{group.title}</p>
                <ul className="mt-1 space-y-0.5 text-xs text-white/70">
                  {group.links.map((l) => (
                    <li key={l.href}>{l.label}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-xs text-white/75">
            <p>{address || "—"}</p>
            <p>{workingHours || "—"}</p>
          </div>
        </div>
        <p className="mt-4 border-t border-white/15 pt-4 text-center text-[10px] text-white/60">
          {rights || "—"}
        </p>
      </div>
    </div>
  );
}
