"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";

export default function PrivacyPage() {
  const { privacy, sectionTitles, text, loading } = useSiteContent();
  const { t } = useLocale();

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
        title={text(sectionTitles.privacyPageTitle)}
        subtitle={text(sectionTitles.privacyPageSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.privacyPageTitle) }]}
      />
      <div className="section-padding bg-background">
        <article className="container-dif mx-auto max-w-3xl">
          <p className="mb-6 text-xs text-muted-foreground">
            {privacy.lastUpdated ? `${t.common.lastUpdated} ${privacy.lastUpdated}` : null}
          </p>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-line leading-relaxed text-foreground/90">
              {text(privacy.body)}
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
