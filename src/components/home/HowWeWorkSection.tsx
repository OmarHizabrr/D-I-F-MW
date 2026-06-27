"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { CmsIconInline } from "@/components/ui/CmsIconBox";

export function HowWeWorkSection() {
  const { howWeWork, sectionTitles, text } = useSiteContent();
  const steps = howWeWork.filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <section className="section-padding">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.howWeWork)}
          subtitle={text(sectionTitles.howWeWorkSubtitle)}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            return (
              <Card key={step.id} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-3xl bg-brand-green/10 text-brand-green-dark dark:text-brand-green">
                  <CmsIconInline
                    iconKey={step.iconKey}
                    iconImageUrl={step.iconImageUrl}
                    boxClassName="h-14 w-14 rounded-3xl"
                  />
                </div>
                <span className="absolute start-4 top-4 text-3xl font-bold text-brand-green/20">
                  {index + 1}
                </span>
                <h3 className="mb-2 font-bold">{text(step.title)}</h3>
                <p className="text-sm text-muted-foreground">{text(step.description)}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
