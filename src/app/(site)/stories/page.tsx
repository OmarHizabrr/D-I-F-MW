"use client";

import Link from "next/link";
import { Quote, MessageSquarePlus } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { isTestimonialPublished } from "@/services/testimonialService";

export default function StoriesPage() {
  const { testimonials, sectionTitles, text, loading } = useSiteContent();
  const items = testimonials
    .filter(isTestimonialPublished)
    .sort((a, b) => a.order - b.order);

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
        title={text(sectionTitles.storiesTitle)}
        subtitle={text(sectionTitles.storiesSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.storiesTitle) }]}
      />

      <div className="section-padding bg-background">
        <div className="container-dif">
          <div className="mb-8 flex justify-center sm:justify-end">
            <Link
              href="/share-testimonial"
              className="inline-flex h-10 items-center gap-2 rounded-xl border-2 border-brand-green px-4 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/10"
            >
              <MessageSquarePlus className="h-4 w-4" />
              {text(sectionTitles.shareStory)}
            </Link>
          </div>

          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">لا توجد قصص منشورة حالياً</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id} className="relative">
                  <Quote className="absolute start-4 top-4 h-8 w-8 text-brand-green/15" />
                  <p className="mb-6 pt-6 text-sm leading-relaxed text-muted-foreground italic sm:text-base">
                    &ldquo;{text(item.quote)}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={text(item.name)} photoURL={item.imageUrl} size="md" />
                    <div>
                      <p className="font-bold">{text(item.name)}</p>
                      <p className="text-xs text-muted-foreground sm:text-sm">{text(item.role)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
