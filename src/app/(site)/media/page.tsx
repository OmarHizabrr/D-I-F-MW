"use client";

import { useMemo, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import type { getDefaultSectionTitles } from "@/data/default-content";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import {
  MediaLightbox,
  MediaTile,
  mediaItemToLightbox,
  type MediaLightboxItem,
} from "@/components/site/MediaLightbox";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
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

type FilterKey = "all" | MediaItem["type"];

export default function MediaPage() {
  const { media, sectionTitles, text, loading } = useSiteContent();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = useMemo(() => {
    const list = media.filter((m) => m.enabled).sort((a, b) => a.order - b.order);
    if (filter === "all") return list;
    return list.filter((m) => m.type === filter);
  }, [media, filter]);

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

  const filters: Array<{ key: FilterKey; label: string }> = [
    { key: "all", label: "الكل" },
    { key: "photo", label: text(sectionTitles.mediaTypePhoto) },
    { key: "video", label: text(sectionTitles.mediaTypeVideo) },
    { key: "opening", label: text(sectionTitles.mediaTypeOpening) },
    { key: "visit", label: text(sectionTitles.mediaTypeVisit) },
  ];

  if (loading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  return (
    <>
      <SitePageHeader title={text(sectionTitles.media)} subtitle={text(sectionTitles.mediaSubtitle)} />

      <div className="section-padding bg-background">
        <div className="container-dif">
          <div className="mb-6 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm",
                  filter === f.key
                    ? "bg-brand-green text-white"
                    : "bg-border-subtle text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">لا توجد وسائط في هذا القسم</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          )}
        </div>
      </div>

      <MediaLightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </>
  );
}
