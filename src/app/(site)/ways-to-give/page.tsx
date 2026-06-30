"use client";

import Link from "next/link";
import { Heart, Calculator, RefreshCw, FolderKanban, Shield } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useMergedPublicProjects } from "@/hooks/useMergedPublicProjects";
import { useDonation } from "@/context/DonationContext";
import { useLocale } from "@/context/LocaleContext";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function WaysToGivePage() {
  const { sectionTitles, donation, text, loading: cmsLoading } = useSiteContent();
  const { projects, loading: mergedLoading } = useMergedPublicProjects();
  const { openDonation } = useDonation();
  const { t, locale } = useLocale();
  const { portalEnabled } = useSystemSettings();

  const featuredProjects = (
    projects.filter((p) => p.featured).length > 0
      ? projects.filter((p) => p.featured)
      : projects
  ).slice(0, 4);

  if (cmsLoading || mergedLoading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  const ways = [
    {
      icon: Calculator,
      title: t.waysToGive.zakatTitle,
      desc: t.waysToGive.zakatDesc,
      href: "/zakat-calculator",
      cta: t.waysToGive.calculatorLink,
    },
    {
      icon: Heart,
      title: t.waysToGive.sadaqahTitle,
      desc: t.waysToGive.sadaqahDesc,
      action: () => openDonation(),
      cta: text(donation.navButtonLabel),
    },
    {
      icon: RefreshCw,
      title: t.waysToGive.monthlyTitle,
      desc: t.waysToGive.monthlyDesc,
      action: () => openDonation({ recurring: true }),
      cta: t.donation.recurringLabel,
    },
    {
      icon: Shield,
      title: t.transparency.title,
      desc: t.waysToGive.transparencyLink,
      href: "/transparency",
      cta: t.waysToGive.transparencyLink,
    },
    ...(portalEnabled
      ? [
          {
            icon: FolderKanban,
            title: locale === "ar" ? "بوابة المتبرعين" : "Donor portal",
            desc:
              locale === "ar"
                ? "تابع مشاريعك التي تدعمها المؤسسة"
                : "Track projects you support",
            href: "/portal",
            cta: locale === "ar" ? "دخول البوابة" : "Open portal",
          },
        ]
      : []),
  ];

  return (
    <>
      <SitePageHeader
        title={text(sectionTitles.waysToGivePageTitle)}
        subtitle={text(sectionTitles.waysToGivePageSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.waysToGivePageTitle) }]}
      />
      <div className="section-padding bg-background">
        <div className="container-dif space-y-12">
          <div className="grid gap-4 md:grid-cols-2">
            {ways.map((way, i) => {
              const Icon = way.icon;
              return (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{way.title}</CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">{way.desc}</p>
                    <div className="mt-4">
                      {way.href ? (
                        <Link href={way.href}>
                          <Button variant="outline" size="sm">
                            {way.cta}
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm" onClick={way.action}>
                          {way.cta}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <section>
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <FolderKanban className="h-5 w-5" />
              {t.waysToGive.projectTitle}
            </h2>
            <p className="mb-4 text-muted-foreground">{t.waysToGive.projectDesc}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {featuredProjects.map((p) => (
                <Card key={`${p.source}-${p.id}`} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.country}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      openDonation({ projectId: p.id, projectName: p.name })
                    }
                  >
                    {text(donation.navButtonLabel)}
                  </Button>
                </Card>
              ))}
            </div>
            <Link href="/projects" className="mt-4 inline-block text-sm font-semibold text-brand-green">
              {text(sectionTitles.navAllProjects)} →
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
