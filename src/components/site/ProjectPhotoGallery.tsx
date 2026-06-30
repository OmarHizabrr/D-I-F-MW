"use client";

import { useMemo, useState } from "react";
import { Images } from "lucide-react";
import {
  MediaLightbox,
  MediaTile,
  type MediaLightboxItem,
} from "@/components/site/MediaLightbox";
import type { ProjectPhoto, PhotoPhase } from "@/types/project-management";
import { PHOTO_PHASES } from "@/types/project-management";

const PHASE_LABELS: Record<PhotoPhase, string> = {
  Before: "قبل التنفيذ",
  During: "أثناء التنفيذ",
  After: "بعد الإنجاز",
};

type ProjectPhotoGalleryProps = {
  photos: Record<PhotoPhase, ProjectPhoto[]>;
  title?: string;
};

export function ProjectPhotoGallery({ photos, title = "معرض الصور" }: ProjectPhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items: MediaLightboxItem[] = useMemo(() => {
    const list: MediaLightboxItem[] = [];
    for (const phase of PHOTO_PHASES) {
      for (const photo of photos[phase]) {
        if (!photo.image) continue;
        list.push({
          id: photo.id,
          title: photo.title || PHASE_LABELS[phase],
          description: photo.description,
          imageUrl: photo.image,
          typeLabel: PHASE_LABELS[phase],
        });
      }
    }
    return list;
  }, [photos]);

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <Images className="h-5 w-5 text-brand-green" />
        {title}
        <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
      </h2>

      {PHOTO_PHASES.map((phase) => {
        const phasePhotos = photos[phase].filter((p) => p.image);
        if (phasePhotos.length === 0) return null;
        return (
          <div key={phase} className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              {PHASE_LABELS[phase]}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {phasePhotos.map((photo) => {
                const globalIndex = items.findIndex((i) => i.id === photo.id);
                return (
                  <MediaTile
                    key={photo.id}
                    title={photo.title || PHASE_LABELS[phase]}
                    imageUrl={photo.image}
                    onClick={() => setLightboxIndex(globalIndex)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      <MediaLightbox
        items={items}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </section>
  );
}
