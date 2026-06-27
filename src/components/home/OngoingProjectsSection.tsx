"use client";

import { useState } from "react";
import Image from "next/image";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { sectionIcons } from "@/lib/icons";

export function OngoingProjectsSection() {
  const { projects, sectionTitles, text } = useSiteContent();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const ongoing = projects
    .filter((p) => p.enabled && p.status === "ongoing")
    .sort((a, b) => a.order - b.order);

  async function handleViewDetails(id: string) {
    setLoadingId(id);
    await new Promise((r) => setTimeout(r, 1200));
    setLoadingId(null);
  }

  return (
    <section id="projects" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.projects)}
          subtitle={text(sectionTitles.projectsSubtitle)}
        />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {ongoing.map((project) => (
            <Card key={project.id} padding="none" className="overflow-hidden">
              {project.imageUrl ? (
                <div className="relative h-40 sm:h-48">
                  <Image
                    src={project.imageUrl}
                    alt={text(project.name)}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <MediaPlaceholder icon={sectionIcons.project} className="h-40 sm:h-48" />
              )}
              <CardContent className="p-4 sm:p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">{text(project.name)}</CardTitle>
                  <Badge variant="outline">{project.code || project.id}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {text(sectionTitles.projectsCountry)}: {text(project.country)}
                </p>
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span>{text(sectionTitles.projectsProgress)}</span>
                    <span className="font-bold text-brand-green">{project.progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-border-subtle">
                    <div
                      className="h-full rounded-full bg-brand-green transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {text(sectionTitles.projectsLastUpdate)}: {project.lastUpdate}
                </p>
                <CardFooter className="mt-4 !p-0">
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    loading={loadingId === project.id}
                    loadingText="..."
                    onClick={() => handleViewDetails(project.id)}
                  >
                    {text(sectionTitles.projectsViewDetails)}
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
