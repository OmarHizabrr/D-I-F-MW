"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { whyUsIcons } from "@/lib/icons";

export function WhyUsSection() {
  const { whyUs, sectionTitles, text } = useSiteContent();
  const items = whyUs.filter((i) => i.enabled).sort((a, b) => a.order - b.order);

  return (
    <section id="about" className="section-padding bg-brand-green/5 dark:bg-brand-green/10">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.whyUs)}
          subtitle={text(sectionTitles.whyUsSubtitle)}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = whyUsIcons[item.iconKey] || whyUsIcons.transparency;
            return (
              <Card key={item.id} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold">{text(item.title)}</h3>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
