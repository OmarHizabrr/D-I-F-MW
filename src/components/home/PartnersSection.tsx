"use client";

import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { partnersData } from "@/data/mock";

export function PartnersSection() {
  const { t } = useLocale();

  return (
    <section className="section-padding">
      <div className="container-dif">
        <SectionHeader title={t.partners.title} subtitle={t.partners.subtitle} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partnersData.map((partner) => (
            <div
              key={partner}
              className="dif-card flex h-24 items-center justify-center p-4 text-center text-sm font-semibold text-muted-foreground"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
