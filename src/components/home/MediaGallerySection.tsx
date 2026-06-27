"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import type { getDefaultSectionTitles } from "@/data/default-content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconBox } from "@/components/ui/IconBox";
import { mediaGradient, sectionIcons } from "@/lib/icons";
import type { MediaItem } from "@/types/cms";
import { cn } from "@/lib/utils";

const mediaIconMap = {
  photo: sectionIcons.mediaPhoto,
  video: sectionIcons.mediaVideo,
  opening: sectionIcons.mediaOpening,
  visit: sectionIcons.mediaVisit,
} as const;

const mediaTypeLabels = {
  photo: "mediaTypePhoto",
  video: "mediaTypeVideo",
  opening: "mediaTypeOpening",
  visit: "mediaTypeVisit",
} as const satisfies Record<MediaItem["type"], keyof ReturnType<typeof getDefaultSectionTitles>>;

export function MediaGallerySection() {
  const { media, sectionTitles, text } = useSiteContent();
  const items = media.filter((m) => m.enabled).sort((a, b) => a.order - b.order);
  const display = items.length ? [...items, ...items] : [];

  return (
    <section id="media" className="section-padding overflow-hidden">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.media)}
          subtitle={text(sectionTitles.mediaSubtitle)}
        />
      </div>

      {display.length > 0 && (
        <div className="relative mt-4 w-full overflow-hidden">
          <div className="flex w-max max-w-none animate-marquee gap-3 pe-3 ps-3 sm:gap-4 sm:pe-4 sm:ps-4">
            {display.map((item, i) => {
              const Icon = mediaIconMap[item.type] || sectionIcons.mediaPhoto;
              const labelKey = mediaTypeLabels[item.type];
              const title = text(item.title) || text(sectionTitles[labelKey]);
              return (
                <div
                  key={`${item.id}-${i}`}
                  className={cn(
                    "relative h-40 w-52 shrink-0 overflow-hidden rounded-3xl border border-border-subtle shadow-md sm:h-52 sm:w-72",
                    "bg-gradient-to-br",
                    !item.imageUrl && mediaGradient(item.type, i)
                  )}
                >
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 text-white">
                    {item.youtubeUrl ? (
                      <Play className="h-10 w-10" />
                    ) : (
                      <IconBox icon={Icon} variant="gradient" size="lg" />
                    )}
                    <span className="text-xs font-medium sm:text-sm">{title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
