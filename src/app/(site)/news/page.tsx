"use client";

import { useMemo } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { NewsCard } from "@/components/site/NewsCard";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";

export default function NewsPage() {
  const { news, sectionTitles, text, loading } = useSiteContent();

  const items = useMemo(
    () => news.filter((n) => n.enabled).sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order),
    [news]
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
      <SitePageHeader title={text(sectionTitles.news)} subtitle={text(sectionTitles.newsSubtitle)} />
      <div className="section-padding bg-background">
        <div className="container-dif">
          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">لا توجد أخبار حالياً</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  readMoreLabel={text(sectionTitles.newsReadMore)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
