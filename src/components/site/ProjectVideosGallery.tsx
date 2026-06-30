"use client";

import { Play } from "lucide-react";
import type { ProjectVideo } from "@/types/project-management";
import { ProjectVideoEmbed } from "@/components/site/ProjectVideoEmbed";
import { Card } from "@/components/ui/Card";

type ProjectVideosGalleryProps = {
  videos: ProjectVideo[];
  title?: string;
};

export function ProjectVideosGallery({ videos, title = "الفيديوهات" }: ProjectVideosGalleryProps) {
  if (videos.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <Play className="h-5 w-5 text-brand-green" />
        {title}
        <span className="text-sm font-normal text-muted-foreground">({videos.length})</span>
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {videos.map((video) => (
          <Card key={video.id} padding="sm" className="overflow-hidden">
            <ProjectVideoEmbed
              url={video.video}
              title={video.title}
              thumbnail={video.thumbnail}
            />
            <div className="px-2 pb-2 pt-3">
              <p className="font-semibold">{video.title}</p>
              {video.duration && (
                <p className="mt-1 text-xs text-muted-foreground">{video.duration}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
