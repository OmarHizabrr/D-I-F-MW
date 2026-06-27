"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { sectionIcons } from "@/lib/icons";

export function TestimonialsSection() {
  const { testimonials, sectionTitles, text } = useSiteContent();
  const items = testimonials.filter((t) => t.enabled).sort((a, b) => a.order - b.order);

  return (
    <section className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.testimonials)}
          subtitle={text(sectionTitles.testimonialsSubtitle)}
        />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="relative">
              <Quote className="absolute start-4 top-4 h-8 w-8 text-brand-green/15" />
              <p className="mb-6 pt-6 text-sm leading-relaxed text-muted-foreground italic sm:text-base">
                &ldquo;{text(item.quote)}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {item.imageUrl ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={item.imageUrl}
                      alt={text(item.name)}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <IconBox icon={sectionIcons.user} size="md" />
                )}
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
