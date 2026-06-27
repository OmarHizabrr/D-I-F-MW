"use client";

import { Quote } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { testimonialsData, getLocalized } from "@/data/mock";
import { sectionIcons } from "@/lib/icons";

export function TestimonialsSection() {
  const { t, locale } = useLocale();

  return (
    <section className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader title={t.testimonials.title} subtitle={t.testimonials.subtitle} />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {testimonialsData.map((item) => (
            <Card key={item.id} className="relative">
              <Quote className="absolute start-4 top-4 h-8 w-8 text-brand-green/15" />
              <p className="mb-6 pt-6 text-sm leading-relaxed text-muted-foreground italic sm:text-base">
                &ldquo;{getLocalized(item.quote, locale)}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <IconBox icon={sectionIcons.user} size="md" />
                <div>
                  <p className="font-bold">{getLocalized(item.name, locale)}</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {getLocalized(item.role, locale)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
