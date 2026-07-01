"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";
import {
  buildFooterLinkGroups,
  capFooterGroupLinks,
  footerUsesGroupedLinks,
  navChildLabel,
  normalizeNavHref,
  type NavLabels,
} from "@/lib/nav-utils";
import { getSocialPlatformIcon } from "@/lib/social-platform-icons";
import { DonateButton } from "@/components/donation/DonateButton";
import { SiteLink } from "@/components/site/SiteLink";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import type { LocaleCode } from "@/types/cms";

function FooterColumnTitle({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
      {children}
    </p>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <SiteLink
      href={href}
      className="text-[13px] leading-snug text-white/70 transition-colors hover:text-white"
    >
      {children}
    </SiteLink>
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

  const socialLinks = topbar.socialLinks
    .filter((s) => s.enabled && s.url && s.url !== "#")
    .sort((a, b) => a.order - b.order);

  const orgTitle = locale === "ar" ? t.footer.orgNameAr : t.footer.orgNameEn;
  const viewAllLabel = { ar: t.footer.viewAll, en: t.footer.viewAll, ny: t.footer.viewAll };

  return (
    <footer className="safe-bottom relative mt-auto border-t-4 border-brand-green-light bg-brand-green-dark text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/10" />

      <div className="container-dif relative px-4 py-12 sm:px-6 sm:py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* العلامة والرسالة */}
          <div className="lg:col-span-4 xl:col-span-4">
            <SiteLink
              href="/"
              className="mb-6 inline-flex items-center gap-3.5 transition-opacity hover:opacity-90"
            >
              <Image
                src="/Image/login.png"
                alt={orgTitle}
                width={52}
                height={52}
                className="h-[52px] w-[52px] shrink-0 rounded-full border border-white/20 bg-white p-0.5 shadow-sm"
              />
              <div className="min-w-0">
                <p className="text-lg font-bold leading-tight tracking-tight">{orgTitle}</p>
                <p className="mt-0.5 text-xs font-medium text-white/55">{t.footer.orgTagline}</p>
              </div>
            </SiteLink>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-white/75">
              {text(footer.description)}
            </p>

            <div className="mb-6 flex flex-wrap gap-2.5">
              <DonateButton variant="primary" size="sm" />
              {portalEnabled && (
                <SiteLink
                  href="/portal"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/10"
                >
                  {t.topBar.donorPortal}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                </SiteLink>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div>
                <FooterColumnTitle>{t.footer.followUs}</FooterColumnTitle>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => {
                    const Icon = getSocialPlatformIcon(link.platform);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/85 transition-colors hover:border-white/25 hover:bg-white/15 hover:text-white"
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

          {/* أعمدة الروابط */}
          <div className="lg:col-span-8 xl:col-span-8">
            {grouped && linkGroups.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
                {linkGroups.map((group) => {
                  const parent = navItems.find((n) => n.id === group.id);
                  const parentHref = normalizeNavHref(parent?.href ?? "/");
                  const links = capFooterGroupLinks(group.links, parentHref, viewAllLabel);

                  return (
                    <nav key={group.id} aria-label={text(group.title)}>
                      <FooterColumnTitle>{text(group.title)}</FooterColumnTitle>
                      <ul className="space-y-2.5">
                        {links.map((link) => (
                          <li key={link.id}>
                            <FooterLink href={link.href}>
                              {navChildLabel(link, locale as LocaleCode)}
                            </FooterLink>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  );
                })}
              </div>
            ) : flatLinks.length > 0 ? (
              <nav aria-label={text(sectionTitles.footerQuickLinks)}>
                <FooterColumnTitle>{text(sectionTitles.footerQuickLinks)}</FooterColumnTitle>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
                  {flatLinks.map((item) => (
                    <li key={item.id}>
                      <FooterLink href={normalizeNavHref(item.href)}>{text(item.label)}</FooterLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>

        {/* شريط التواصل */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-black/15 px-5 py-4 backdrop-blur-sm sm:px-6">
          <ul className="flex flex-col gap-3 text-sm text-white/75 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
            <li className="flex items-start gap-2.5 sm:items-center">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/50 sm:mt-0" />
              <span>
                {text(footer.address)}
                {footer.mapsUrl && (
                  <>
                    {" · "}
                    <a
                      href={footer.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-white/90 underline decoration-white/30 underline-offset-2 hover:decoration-white"
                    >
                      {text(sectionTitles.contactMapsLink)}
                    </a>
                  </>
                )}
              </span>
            </li>
            {topbar.phone && (
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-white/50" />
                <a
                  href={`tel:${topbar.phone.replace(/\s/g, "")}`}
                  dir="ltr"
                  className="hover:text-white"
                >
                  {topbar.phone}
                </a>
              </li>
            )}
            {topbar.email && (
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-white/50" />
                <a href={`mailto:${topbar.email}`} dir="ltr" className="hover:text-white">
                  {topbar.email}
                </a>
              </li>
            )}
            <li className="flex items-start gap-2.5 sm:items-center">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/50 sm:mt-0" />
              <span>{text(footer.workingHours)}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* الشريط السفلي */}
      <div className="relative border-t border-white/10 bg-black/20">
        <div className="container-dif flex flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-white/55 sm:flex-row sm:px-6 sm:text-start sm:text-sm">
          <p>{text(footer.rights)}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <SiteLink
              href="/privacy"
              className="text-white/70 transition-colors hover:text-white"
            >
              {text(sectionTitles.privacyPageTitle)}
            </SiteLink>
            <span className="hidden text-white/25 sm:inline" aria-hidden>
              |
            </span>
            <SiteLink
              href="/transparency"
              className="text-white/70 transition-colors hover:text-white"
            >
              {text(sectionTitles.navTransparency)}
            </SiteLink>
          </div>
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
};

export function FooterPreview({
  description,
  address,
  workingHours,
  rights,
  quickLinkGroups,
}: FooterPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-brand-green-dark text-white">
      <div className="border-b border-white/10 px-5 py-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
        معاينة التذييل
      </div>
      <div className="p-5 sm:p-6">
        <p className="mb-5 max-w-md text-sm leading-relaxed text-white/75">{description || "—"}</p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {quickLinkGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/45">
                {group.title}
              </p>
              <ul className="space-y-1 text-xs text-white/70">
                {group.links.slice(0, 5).map((l) => (
                  <li key={l.href}>{l.label}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-xs text-white/65">
          {address || "—"} · {workingHours || "—"}
        </p>
        <p className="mt-4 text-center text-[10px] text-white/50">{rights || "—"}</p>
      </div>
    </div>
  );
}
