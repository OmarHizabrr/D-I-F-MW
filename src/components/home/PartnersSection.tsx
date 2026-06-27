"use client";

import { Handshake } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconBox } from "@/components/ui/IconBox";
import { partnersData } from "@/data/mock";

export function PartnersSection() {
  const { t } = useLocale();

  return (
    <section className="section-padding">
      <div className="container-dif">
        <SectionHeader title={t.partners.title} subtitle={t.partners.subtitle} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {partnersData.map((partner) => (
            <div
              key={partner}
              className="dif-card flex flex-col items-center justify-center gap-3 p-4 text-center sm:p-5"
            >
              <IconBox icon={Handshake} size="sm" variant="surface" />
              <span className="text-xs font-semibold leading-snug text-muted-foreground sm:text-sm">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
