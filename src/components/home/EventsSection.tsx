"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { EventCard } from "@/components/site/EventCard";

const HOME_LIMIT = 3;

export function EventsSection() {
  const { events, sectionTitles, text } = useSiteContent();
  const today = new Date().toISOString().slice(0, 10);
  const items = events
    .filter((e) => e.enabled && e.startDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.order - b.order)
    .slice(0, HOME_LIMIT);

  if (!items.length) return null;

  return (
    <section id="events" className="section-padding">
      <div className="container-dif">
        <Reveal>
          <SectionHeader
            title={text(sectionTitles.events)}
            subtitle={text(sectionTitles.eventsSubtitle)}
            viewAllHref="/events"
            viewAllLabel={text(sectionTitles.viewAll)}
          />
        </Reveal>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <EventCard
                item={item}
                readMoreLabel={text(sectionTitles.eventsReadMore)}
                locationLabel={text(sectionTitles.eventsLocation)}
                registerLabel={text(sectionTitles.eventsRegister)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
