"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, ZoomIn } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { YouTubePlayer } from "@/components/site/YouTubePlayer";
import type { MediaItem } from "@/types/cms";
import { cn } from "@/lib/utils";

export type MediaLightboxItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  youtubeUrl?: string;
  typeLabel?: string;
};

export function mediaItemToLightbox(
  item: MediaItem,
  title: string,
  description?: string,
  typeLabel?: string
): MediaLightboxItem {
  return {
    id: item.id,
    title,
    description,
    imageUrl: item.imageUrl,
    youtubeUrl: item.youtubeUrl,
    typeLabel,
  };
}

type MediaLightboxProps = {
  items: MediaLightboxItem[];
  index: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
};

export function MediaLightbox({ items, index, onClose, onChangeIndex }: MediaLightboxProps) {
  const open = index !== null && index >= 0 && index < items.length;
  const item = open ? items[index] : null;

  const goPrev = useCallback(() => {
    if (index === null || items.length <= 1) return;
    onChangeIndex(index <= 0 ? items.length - 1 : index - 1);
  }, [index, items.length, onChangeIndex]);

  const goNext = useCallback(() => {
    if (index === null || items.length <= 1) return;
    onChangeIndex(index >= items.length - 1 ? 0 : index + 1);
  }, [index, items.length, onChangeIndex]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goNext();
      if (e.key === "ArrowRight") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext]);

  if (!item) return null;

  const hasVideo = Boolean(item.youtubeUrl);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={item.title}
      description={item.typeLabel}
      size="full"
      className="!max-w-5xl"
      footer={
        items.length > 1 ? (
          <div className="flex w-full items-center justify-between gap-2">
            <Button variant="secondary" size="sm" onClick={goPrev}>
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <span className="text-xs text-muted-foreground">
              {(index ?? 0) + 1} / {items.length}
            </span>
            <Button variant="secondary" size="sm" onClick={goNext}>
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={onClose}>
            إغلاق
          </Button>
        )
      }
    >
      <div className="space-y-4">
        {hasVideo ? (
          <YouTubePlayer url={item.youtubeUrl!} title={item.title} />
        ) : item.imageUrl ? (
          <div className="relative mx-auto max-h-[70vh] overflow-hidden rounded-2xl bg-black/5">
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={1200}
              height={800}
              className="mx-auto max-h-[70vh] w-auto object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-2xl bg-border-subtle text-muted-foreground">
            لا توجد صورة
          </div>
        )}

        {item.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        )}

        {hasVideo && item.imageUrl && (
          <details className="rounded-xl border border-border-subtle p-3">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <ZoomIn className="h-4 w-4" />
              صورة الغلاف
            </summary>
            <div className="relative mt-3 aspect-video overflow-hidden rounded-xl">
              <Image src={item.imageUrl} alt="" fill className="object-cover" unoptimized />
            </div>
          </details>
        )}
      </div>
    </Dialog>
  );
}

type MediaTileProps = {
  title: string;
  imageUrl?: string;
  youtubeUrl?: string;
  gradient?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export function MediaTile({
  title,
  imageUrl,
  youtubeUrl,
  gradient,
  icon,
  onClick,
  className,
}: MediaTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border-subtle text-start shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]",
        !imageUrl && gradient && `bg-gradient-to-br ${gradient}`,
        className
      )}
    >
      {imageUrl && (
        <Image src={imageUrl} alt={title} fill className="object-cover transition-transform group-hover:scale-105" unoptimized />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <div className="mb-2 flex items-center gap-2">
          {youtubeUrl ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <Play className="h-5 w-5 fill-white" />
            </span>
          ) : (
            icon
          )}
        </div>
        <p className="line-clamp-2 text-sm font-semibold sm:text-base">{title}</p>
      </div>
    </button>
  );
}
