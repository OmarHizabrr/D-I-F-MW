"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import type { ProjectUpdate } from "@/types/project-management";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectVideoEmbed } from "@/components/site/ProjectVideoEmbed";

type ProjectUpdatesFeedProps = {
  updates: ProjectUpdate[];
  title?: string;
  emptyMessage?: string;
  isNew?: (createdAt?: string) => boolean;
};

function formatUpdateDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export function ProjectUpdatesFeed({
  updates,
  title = "تحديثات المشروع",
  emptyMessage,
  isNew,
}: ProjectUpdatesFeedProps) {
  if (updates.length === 0) {
    if (!emptyMessage) return null;
    return (
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Bell className="h-5 w-5 text-brand-green" />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <Bell className="h-5 w-5 text-brand-green" />
        {title}
        <span className="text-sm font-normal text-muted-foreground">({updates.length})</span>
      </h2>
      <div className="space-y-4">
        {updates.map((update) => {
          const showNew = isNew?.(update.createdAt);
          return (
            <Card key={update.id} padding="md" className="relative">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{update.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatUpdateDate(update.createdAt)}
                  </p>
                </div>
                {showNew && <Badge variant="default">جديد</Badge>}
              </div>
              {update.description && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {update.description}
                </p>
              )}
              {update.images.length > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {update.images.map((src, index) => (
                    <div
                      key={`${update.id}-img-${index}`}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border-subtle"
                    >
                      <Image
                        src={src}
                        alt={update.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}
              {update.videos.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {update.videos.map((url, index) => (
                    <ProjectVideoEmbed
                      key={`${update.id}-vid-${index}`}
                      url={url}
                      title={`${update.title} — ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
