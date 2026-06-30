"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { resolveNavChildren, navChildLabel } from "@/lib/nav-utils";
import { DonateButton } from "@/components/donation/DonateButton";
import { SiteSearchButton } from "@/components/site/SiteSearch";
import { cn } from "@/lib/utils";
import type { LocaleCode, NavItem } from "@/types/cms";

function DesktopNavItem({
  item,
  label,
  children,
  onNavigate,
}: {
  item: NavItem;
  label: string;
  children: ReturnType<typeof resolveNavChildren>;
  onNavigate?: () => void;
}) {
  const { locale } = useLocale();
  const hasChildren = children.length > 0;

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="rounded-xl px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-brand-green/10 hover:text-brand-green-dark dark:hover:text-brand-green"
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="group relative">
      <Link
        href={item.href}
        onClick={onNavigate}
        className="inline-flex items-center gap-0.5 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-brand-green/10 hover:text-brand-green-dark dark:hover:text-brand-green"
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />
      </Link>
      <div className="invisible absolute start-0 top-full z-50 min-w-[14rem] max-w-[min(20rem,calc(100vw-2rem))] pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="max-h-[min(70vh,24rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-border-subtle bg-nav-bg py-1 shadow-lg">
          {children.map((child) => (
            <Link
              key={child.id}
              href={child.href}
              onClick={onNavigate}
              className="block px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-brand-green/10 hover:text-brand-green-dark dark:hover:text-brand-green"
            >
              {navChildLabel(child, locale as LocaleCode)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({
  item,
  label,
  children,
  onNavigate,
}: {
  item: NavItem;
  label: string;
  children: ReturnType<typeof resolveNavChildren>;
  onNavigate: () => void;
}) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const hasChildren = children.length > 0;

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="rounded-2xl px-4 py-3.5 text-base font-medium transition-colors active:bg-brand-green/10 hover:bg-brand-green/10"
      >
        {label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors hover:bg-brand-green/10"
      >
        <span>{label}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ms-3 flex flex-col border-s border-border-subtle ps-2">
          {children.map((child) => (
            <Link
              key={child.id}
              href={child.href}
              onClick={onNavigate}
              className="rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-brand-green/10 hover:text-foreground"
            >
              {navChildLabel(child, locale as LocaleCode)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navigation() {
  const { locale } = useLocale();
  const { portalEnabled } = useSystemSettings();
  const { navItems, programs, sectionTitles, text } = useSiteContent();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navItems.filter((i) => i.enabled).sort((a, b) => a.order - b.order);

  const navLabels = {
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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="relative sticky top-0 z-40 w-full max-w-[100vw] overflow-visible border-b border-border-subtle bg-nav-bg/95 text-nav-fg backdrop-blur-md">
      <div className="container-dif flex h-14 min-w-0 items-center gap-2 sm:h-16 md:h-[4.5rem]">
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3"
        >
          <Image
            src="/Image/login.png"
            alt="D.I.F Logo"
            width={48}
            height={48}
            className="h-9 w-9 shrink-0 rounded-full sm:h-10 sm:w-10 md:h-12 md:w-12"
          />
          <div className="min-w-0 overflow-hidden">
            <p className="truncate text-xs font-bold leading-tight text-brand-green-dark dark:text-brand-green sm:text-sm">
              {locale === "ar" ? "مؤسسة التطوير والتنمية" : "D.I.F"}
            </p>
            <p className="hidden truncate text-[10px] text-muted-foreground min-[480px]:block">
              Development & Investment Foundation
            </p>
          </div>
        </Link>

        <nav className="hidden shrink-0 items-center gap-0.5 xl:flex">
          {items.map((item) => (
            <DesktopNavItem
              key={item.id}
              item={item}
              label={text(item.label)}
              children={resolveNavChildren(item, programs, navLabels)}
            />
          ))}
          <DonateButton variant="nav" size="sm" className="ms-1" />
          {portalEnabled && (
            <Link
              href="/portal"
              className="ms-1 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-brand-green/10 hover:text-brand-green"
            >
              {locale === "ar" ? "بوابة المتبرعين" : "Donor portal"}
            </Link>
          )}
          <SiteSearchButton className="ms-1 rounded-xl p-2 text-foreground/70 hover:bg-brand-green/10 hover:text-brand-green" />
          <Link
            href="/admin/login"
            className="ms-1 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground/60 transition-colors hover:bg-brand-green/10 hover:text-brand-green"
          >
            {locale === "ar" ? "دخول" : "Login"}
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors hover:bg-brand-green/10 active:bg-brand-green/15 xl:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40 xl:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <nav
            className={cn(
              "absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-3.5rem)] overflow-y-auto",
              "border-b border-border-subtle bg-nav-bg shadow-lg xl:hidden sm:max-h-[calc(100dvh-4rem)]"
            )}
          >
            <div className="container-dif flex flex-col gap-0.5 py-3 pb-safe">
              {items.map((item) => (
                <MobileNavItem
                  key={item.id}
                  item={item}
                  label={text(item.label)}
                  children={resolveNavChildren(item, programs, navLabels)}
                  onNavigate={closeMobile}
                />
              ))}
              <DonateButton variant="nav" size="md" className="mx-4 mt-2" />
              {portalEnabled && (
                <Link
                  href="/portal"
                  onClick={closeMobile}
                  className="rounded-2xl px-4 py-3.5 text-base font-medium text-foreground/80 transition-colors hover:bg-brand-green/10"
                >
                  {locale === "ar" ? "بوابة المتبرعين" : "Donor portal"}
                </Link>
              )}
              <Link
                href="/admin/login"
                onClick={closeMobile}
                className="rounded-2xl px-4 py-3.5 text-base font-medium text-muted-foreground transition-colors hover:bg-brand-green/10"
              >
                {locale === "ar" ? "تسجيل الدخول" : "Login"}
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
