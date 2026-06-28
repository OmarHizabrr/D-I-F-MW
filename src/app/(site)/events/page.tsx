"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { EventCard } from "@/components/site/EventCard";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";

export default function EventsPage() {
  const { events, sectionTitles, text, loading } = useSiteContent();
  const items = events
    .filter((e) => e.enabled)
    .sort((a, b) => b.startDate.localeCompare(a.startDate) || a.order - b.order);

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
        title={text(sectionTitles.eventsPageTitle)}
        subtitle={text(sectionTitles.eventsPageSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.eventsPageTitle) }]}
      />
      <div className="section-padding bg-background">
        <div className="container-dif">
          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">لا توجد فعاليات منشورة حالياً</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <EventCard
                  key={item.id}
                  item={item}
                  readMoreLabel={text(sectionTitles.eventsReadMore)}
                  locationLabel={text(sectionTitles.eventsLocation)}
                  registerLabel={text(sectionTitles.eventsRegister)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
