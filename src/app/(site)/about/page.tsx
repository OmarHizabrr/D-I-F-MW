"use client";

import Link from "next/link";
import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { StatsSection } from "@/components/home/StatsSection";
import { HowWeWorkSection } from "@/components/home/HowWeWorkSection";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { Card } from "@/components/ui/Card";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";

export default function AboutPage() {
  const { hero, footer, sectionTitles, text, loading } = useSiteContent();

  if (loading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  return (
    <>
      <SitePageHeader
        title={text(sectionTitles.aboutTitle)}
        subtitle={text(sectionTitles.aboutIntro)}
        breadcrumbs={[{ label: text(sectionTitles.aboutTitle) }]}
      />

      <div className="section-padding">
        <div className="container-dif">
          <Card className="mx-auto max-w-3xl p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {text(sectionTitles.aboutIntro) || text(hero.subtitle) || text(footer.description)}
            </p>
            <div className="mt-6">
            <Link
              href="/about/team"
              className="inline-flex h-11 items-center justify-center rounded-2xl border-2 border-brand-green px-5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/10"
            >
              {text(sectionTitles.teamTitle)}
            </Link>
            </div>
          </Card>
        </div>
      </div>

      <StatsSection />
      <HowWeWorkSection />
      <WhyUsSection />
      <PartnersSection />
    </>
  );
}
