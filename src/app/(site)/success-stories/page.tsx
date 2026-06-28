"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { SuccessStoryCard } from "@/components/site/SuccessStoryCard";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";

export default function SuccessStoriesPage() {
  const { successStories, sectionTitles, text, loading } = useSiteContent();
  const items = successStories
    .filter((s) => s.enabled)
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        b.publishedAt.localeCompare(a.publishedAt) ||
        a.order - b.order
    );

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
        title={text(sectionTitles.successStoriesPageTitle)}
        subtitle={text(sectionTitles.successStoriesPageSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.successStoriesPageTitle) }]}
      />
      <div className="section-padding bg-background">
        <div className="container-dif">
          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">لا توجد قصص منشورة حالياً</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <SuccessStoryCard
                  key={item.id}
                  item={item}
                  readMoreLabel={text(sectionTitles.successStoriesReadMore)}
                  impactLabel={text(sectionTitles.successStoriesImpact)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
