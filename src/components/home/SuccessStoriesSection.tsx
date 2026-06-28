"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SuccessStoryCard } from "@/components/site/SuccessStoryCard";

const HOME_LIMIT = 3;

export function SuccessStoriesSection() {
  const { successStories, sectionTitles, text } = useSiteContent();
  const items = successStories
    .filter((s) => s.enabled)
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        b.publishedAt.localeCompare(a.publishedAt) ||
        a.order - b.order
    )
    .slice(0, HOME_LIMIT);

  if (!items.length) return null;

  return (
    <section id="success-stories" className="section-padding bg-background">
      <div className="container-dif">
        <Reveal>
          <SectionHeader
            title={text(sectionTitles.successStories)}
            subtitle={text(sectionTitles.successStoriesSubtitle)}
            viewAllHref="/success-stories"
            viewAllLabel={text(sectionTitles.viewAll)}
          />
        </Reveal>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <SuccessStoryCard
                item={item}
                readMoreLabel={text(sectionTitles.successStoriesReadMore)}
                impactLabel={text(sectionTitles.successStoriesImpact)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
