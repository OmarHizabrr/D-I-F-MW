"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { ZakatCalculatorWidget } from "@/components/zakat/ZakatCalculatorWidget";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";

export default function ZakatCalculatorPage() {
  const { zakatSettings, sectionTitles, text, loading } = useSiteContent();

  if (loading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  if (!zakatSettings.enabled) {
    return (
      <div className="section-padding text-center text-muted-foreground">
        حاسبة الزكاة غير متاحة حالياً
      </div>
    );
  }

  return (
    <>
      <SitePageHeader
        title={text(zakatSettings.pageTitle)}
        subtitle={text(zakatSettings.pageSubtitle)}
        breadcrumbs={[{ label: text(zakatSettings.pageTitle) }]}
      />
      <div className="section-padding bg-background">
        <div className="container-dif">
          <ZakatCalculatorWidget />
        </div>
      </div>
    </>
  );
}
