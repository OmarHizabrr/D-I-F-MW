"use client";

import { youTubeEmbedUrl } from "@/lib/firebase/storage";
import { YouTubePlayer } from "@/components/site/YouTubePlayer";
import { cn } from "@/lib/utils";

type ProjectVideoEmbedProps = {
  url: string;
  title: string;
  thumbnail?: string;
  className?: string;
};

export function ProjectVideoEmbed({ url, title, thumbnail, className }: ProjectVideoEmbedProps) {
  if (youTubeEmbedUrl(url)) {
    return <YouTubePlayer url={url} title={title} className={className} />;
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border-subtle bg-black",
        className
      )}
    >
      <video
        controls
        playsInline
        preload="metadata"
        poster={thumbnail}
        className="aspect-video w-full"
      >
        <source src={url} />
      </video>
    </div>
  );
}
