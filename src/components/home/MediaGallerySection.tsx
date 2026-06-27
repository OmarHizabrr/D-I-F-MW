"use client";

import { Play, Image as ImageIcon } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mediaItems } from "@/data/mock";

export function MediaGallerySection() {
  const { t } = useLocale();

  const labels = {
    photos: t.mediaGallery.photos,
    videos: t.mediaGallery.videos,
    openings: t.mediaGallery.openings,
    visits: t.mediaGallery.visits,
  };

  return (
    <section id="media" className="section-padding overflow-hidden">
      <div className="container-dif">
        <SectionHeader title={t.mediaGallery.title} subtitle={t.mediaGallery.subtitle} />
      </div>

      <div className="relative mt-4">
        <div className="flex w-max animate-marquee gap-4 px-4">
          {[...mediaItems, ...mediaItems].map((item, i) => (
            <div
              key={i}
              className="relative h-44 w-56 shrink-0 overflow-hidden rounded-2xl border border-border-subtle shadow-md sm:h-52 sm:w-72"
            >
              <div className={`h-full w-full ${item.color} opacity-80`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
                {item.type === "videos" ? (
                  <Play className="h-10 w-10" />
                ) : (
                  <ImageIcon className="h-10 w-10" />
                )}
                <span className="mt-2 text-sm font-medium">{labels[item.type]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
