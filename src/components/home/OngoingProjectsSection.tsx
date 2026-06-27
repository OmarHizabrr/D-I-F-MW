"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { ongoingProjectsData, getLocalized } from "@/data/mock";
import { sectionIcons } from "@/lib/icons";

export function OngoingProjectsSection() {
  const { t, locale } = useLocale();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleViewDetails(id: string) {
    setLoadingId(id);
    await new Promise((r) => setTimeout(r, 1200));
    setLoadingId(null);
  }

  return (
    <section id="projects" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader title={t.ongoingProjects.title} subtitle={t.ongoingProjects.subtitle} />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {ongoingProjectsData.map((project) => (
            <Card key={project.id} padding="none" className="overflow-hidden">
              <MediaPlaceholder icon={sectionIcons.project} className="h-40 sm:h-48" />
              <CardContent className="p-4 sm:p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">
                    {getLocalized(project.name, locale)}
                  </CardTitle>
                  <Badge variant="outline">{project.id}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t.ongoingProjects.country}: {getLocalized(project.country, locale)}
                </p>
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span>{t.ongoingProjects.progress}</span>
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
                  {t.ongoingProjects.lastUpdate}: {project.lastUpdate}
                </p>
                <CardFooter className="mt-4 !p-0">
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    loading={loadingId === project.id}
                    loadingText={t.common.loading}
                    onClick={() => handleViewDetails(project.id)}
                  >
                    {t.ongoingProjects.viewDetails}
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
