"use client";

import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconBox } from "@/components/ui/IconBox";
import { mediaItems } from "@/data/mock";
import { sectionIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";

const mediaLabels = {
  mediaPhoto: "photos",
  mediaVideo: "videos",
  mediaOpening: "openings",
  mediaVisit: "visits",
} as const;

export function MediaGallerySection() {
  const { t } = useLocale();

  return (
    <section id="media" className="section-padding overflow-hidden">
      <div className="container-dif">
        <SectionHeader title={t.mediaGallery.title} subtitle={t.mediaGallery.subtitle} />
      </div>

      <div className="relative mt-4 w-full overflow-hidden">
        <div className="flex w-max max-w-none animate-marquee gap-3 pe-3 ps-3 sm:gap-4 sm:pe-4 sm:ps-4">
          {[...mediaItems, ...mediaItems].map((item, i) => {
            const Icon = sectionIcons[item.type];
            const labelKey = mediaLabels[item.type];
            return (
              <div
                key={i}
                className={cn(
                  "relative h-40 w-52 shrink-0 overflow-hidden rounded-3xl border border-border-subtle shadow-md sm:h-52 sm:w-72",
                  "bg-gradient-to-br",
                  item.color
                )}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 text-white">
                  <IconBox icon={Icon} variant="gradient" size="lg" />
                  <span className="text-xs font-medium sm:text-sm">
                    {t.mediaGallery[labelKey]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
