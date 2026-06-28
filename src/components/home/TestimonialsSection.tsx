"use client";

import Link from "next/link";
import { Quote, MessageSquarePlus } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { isTestimonialPublished } from "@/services/testimonialService";

export function TestimonialsSection() {
  const { testimonials, sectionTitles, text } = useSiteContent();
  const items = testimonials
    .filter(isTestimonialPublished)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.testimonials)}
          subtitle={text(sectionTitles.testimonialsSubtitle)}
          viewAllHref="/stories"
          viewAllLabel={text(sectionTitles.viewAll)}
        />

        <div className="mb-6 flex justify-center sm:justify-end">
          <Link
            href="/share-testimonial"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border-2 border-brand-green px-3.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/10"
          >
            <MessageSquarePlus className="h-4 w-4" />
            شارك رأيك عنا
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="relative">
              <Quote className="absolute start-4 top-4 h-8 w-8 text-brand-green/15" />
              <p className="mb-6 pt-6 text-sm leading-relaxed text-muted-foreground italic sm:text-base">
                &ldquo;{text(item.quote)}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={text(item.name)}
                  photoURL={item.imageUrl}
                  size="md"
                />
                <div>
                  <p className="font-bold">{text(item.name)}</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">{text(item.role)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
