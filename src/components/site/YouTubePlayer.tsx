"use client";

import { youTubeEmbedUrl } from "@/lib/firebase/storage";
import { cn } from "@/lib/utils";

type YouTubePlayerProps = {
  url: string;
  title?: string;
  className?: string;
};

export function YouTubePlayer({ url, title = "فيديو", className }: YouTubePlayerProps) {
  const embedUrl = youTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border-subtle bg-black", className)}>
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
