"use client";

import Image from "next/image";
import { Handshake } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconBox } from "@/components/ui/IconBox";

export function PartnersSection() {
  const { partners, sectionTitles, text } = useSiteContent();
  const items = partners.filter((p) => p.enabled).sort((a, b) => a.order - b.order);

  return (
    <section className="section-padding">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.partners)}
          subtitle={text(sectionTitles.partnersSubtitle)}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {items.map((partner) => (
            <a
              key={partner.id}
              href={partner.websiteUrl || "#"}
              target={partner.websiteUrl ? "_blank" : undefined}
              rel={partner.websiteUrl ? "noopener noreferrer" : undefined}
              className="dif-card flex flex-col items-center justify-center gap-3 p-4 text-center sm:p-5"
            >
              {partner.logoUrl ? (
                <div className="relative h-12 w-full">
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <IconBox icon={Handshake} size="sm" variant="surface" />
              )}
              <span className="text-xs font-semibold leading-snug text-muted-foreground sm:text-sm">
                {partner.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
