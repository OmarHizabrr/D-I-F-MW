"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NewsCard } from "@/components/site/NewsCard";

const HOME_LIMIT = 3;

export function LatestNewsSection() {
  const { news, sectionTitles, text } = useSiteContent();
  const items = news
    .filter((n) => n.enabled)
    .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order)
    .slice(0, HOME_LIMIT);

  return (
    <section id="news" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.news)}
          subtitle={text(sectionTitles.newsSubtitle)}
          viewAllHref="/news"
          viewAllLabel={text(sectionTitles.viewAll)}
        />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              readMoreLabel={text(sectionTitles.newsReadMore)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
