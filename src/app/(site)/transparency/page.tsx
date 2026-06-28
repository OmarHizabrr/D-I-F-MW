"use client";

import Link from "next/link";
import { FileText, Shield, BarChart3 } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { Card } from "@/components/ui/Card";
import { CmsIconInline } from "@/components/ui/CmsIconBox";

export default function TransparencyPage() {
  const {
    sectionTitles,
    stats,
    licenses,
    downloads,
    whyUs,
    text,
    loading,
  } = useSiteContent();
  const { t } = useLocale();

  if (loading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  const reports = downloads.filter((d) => d.enabled && d.fileType === "report");
  const licenseItems = licenses.filter((l) => l.enabled);

  return (
    <>
      <SitePageHeader
        title={text(sectionTitles.transparencyPageTitle)}
        subtitle={text(sectionTitles.transparencyPageSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.transparencyPageTitle) }]}
      />
      <div className="section-padding bg-background">
        <div className="container-dif space-y-12">
          <p className="max-w-3xl text-lg text-muted-foreground">{t.transparency.intro}</p>

          <section>
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <BarChart3 className="h-5 w-5 text-brand-green" />
              {t.transparency.statsTitle}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats
                .filter((s) => s.enabled)
                .map((item) => (
                  <Card key={item.id} className="p-5 text-center">
                    <p className="text-3xl font-bold text-brand-green">{item.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{text(item.label)}</p>
                  </Card>
                ))}
            </div>
          </section>

          <section>
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <FileText className="h-5 w-5 text-brand-green" />
              {t.transparency.reportsTitle}
            </h2>
            {reports.length === 0 ? (
              <p className="text-muted-foreground">لا توجد تقارير منشورة بعد</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reports.map((item) => (
                  <Card key={item.id} className="p-5">
                    <h3 className="font-bold">{text(item.title)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{text(item.description)}</p>
                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm font-semibold text-brand-green hover:underline"
                      >
                        {t.transparency.downloadReport} →
                      </a>
                    )}
                  </Card>
                ))}
              </div>
            )}
            <Link href="/resources" className="mt-4 inline-block text-sm font-semibold text-brand-green">
              {text(sectionTitles.viewAll)} →
            </Link>
          </section>

          <section>
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <Shield className="h-5 w-5 text-brand-green" />
              {t.transparency.licensesTitle}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {licenseItems.map((item) => (
                <Card key={item.id} className="p-5 text-center">
                  <CmsIconInline
                    iconKey={item.iconKey}
                    iconImageUrl={item.iconImageUrl}
                    boxClassName="mx-auto mb-3 h-12 w-12 rounded-2xl"
                  />
                  <h3 className="text-sm font-bold">{text(item.title)}</h3>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-xl font-bold">{t.transparency.whyTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {whyUs
                .filter((w) => w.enabled)
                .map((item) => (
                  <Card key={item.id} className="p-5 text-center">
                    <CmsIconInline
                      iconKey={item.iconKey}
                      iconImageUrl={item.iconImageUrl}
                      boxClassName="mx-auto mb-3 h-12 w-12 rounded-2xl"
                    />
                    <h3 className="font-bold">{text(item.title)}</h3>
                  </Card>
                ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
