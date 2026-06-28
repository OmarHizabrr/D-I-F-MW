"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "@/components/site/FaqAccordion";

const HOME_LIMIT = 5;

export function FaqSection() {
  const { faq, sectionTitles, text } = useSiteContent();
  const items = faq.filter((f) => f.enabled).sort((a, b) => a.order - b.order).slice(0, HOME_LIMIT);

  if (!items.length) return null;

  return (
    <section id="faq" className="section-padding bg-surface">
      <div className="container-dif mx-auto max-w-3xl">
        <Reveal>
          <SectionHeader
            title={text(sectionTitles.faq)}
            subtitle={text(sectionTitles.faqSubtitle)}
            viewAllHref="/faq"
            viewAllLabel={text(sectionTitles.viewAll)}
          />
        </Reveal>
        <Reveal delay={100}>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
