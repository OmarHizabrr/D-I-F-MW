"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";

export default function FaqPage() {
  const { faq, sectionTitles, text, loading } = useSiteContent();
  const items = faq.filter((f) => f.enabled).sort((a, b) => a.order - b.order);

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
        title={text(sectionTitles.faqPageTitle)}
        subtitle={text(sectionTitles.faqPageSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.faqPageTitle) }]}
      />
      <div className="section-padding bg-background">
        <div className="container-dif mx-auto max-w-3xl">
          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">لا توجد أسئلة منشورة حالياً</p>
          ) : (
            <FaqAccordion items={items} />
          )}
        </div>
      </div>
    </>
  );
}
