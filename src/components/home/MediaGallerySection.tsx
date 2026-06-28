"use client";

import { useMemo, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import type { getDefaultSectionTitles } from "@/data/default-content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  MediaLightbox,
  MediaTile,
  mediaItemToLightbox,
  type MediaLightboxItem,
} from "@/components/site/MediaLightbox";
import { IconBox } from "@/components/ui/IconBox";
import { mediaGradient, sectionIcons } from "@/lib/icons";
import type { MediaItem } from "@/types/cms";

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

const HOME_LIMIT = 6;

export function MediaGallerySection() {
  const { media, sectionTitles, text } = useSiteContent();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = useMemo(
    () => media.filter((m) => m.enabled).sort((a, b) => a.order - b.order).slice(0, HOME_LIMIT),
    [media]
  );

  const lightboxItems: MediaLightboxItem[] = useMemo(
    () =>
      items.map((item) => {
        const labelKey = mediaTypeLabels[item.type];
        return mediaItemToLightbox(
          item,
          text(item.title) || text(sectionTitles[labelKey]),
          text(item.description),
          text(sectionTitles[labelKey])
        );
      }),
    [items, text, sectionTitles]
  );

  return (
    <section id="media" className="section-padding">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.media)}
          subtitle={text(sectionTitles.mediaSubtitle)}
          viewAllHref="/media"
          viewAllLabel={text(sectionTitles.viewAll)}
        />

        {items.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {items.map((item, index) => {
              const Icon = mediaIconMap[item.type] || sectionIcons.mediaPhoto;
              const labelKey = mediaTypeLabels[item.type];
              const title = text(item.title) || text(sectionTitles[labelKey]);
              return (
                <MediaTile
                  key={item.id}
                  title={title}
                  imageUrl={item.imageUrl}
                  youtubeUrl={item.youtubeUrl}
                  gradient={!item.imageUrl ? mediaGradient(item.type, index) : undefined}
                  icon={<IconBox icon={Icon} variant="gradient" size="md" />}
                  onClick={() => setLightboxIndex(index)}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">لا توجد وسائط بعد</p>
        )}
      </div>

      <MediaLightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </section>
  );
}
