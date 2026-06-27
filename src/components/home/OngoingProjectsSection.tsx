"use client";

import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ongoingProjectsData, getLocalized } from "@/data/mock";

export function OngoingProjectsSection() {
  const { t, locale } = useLocale();

  return (
    <section id="projects" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader title={t.ongoingProjects.title} subtitle={t.ongoingProjects.subtitle} />
        <div className="grid gap-6 md:grid-cols-2">
          {ongoingProjectsData.map((project) => (
            <Card key={project.id} padding="none">
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-brand-green/20 to-brand-brown/20 text-5xl">
                🏗️
              </div>
              <CardContent className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <CardTitle>{getLocalized(project.name, locale)}</CardTitle>
                  <Badge variant="outline">{project.id}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t.ongoingProjects.country}: {getLocalized(project.country, locale)}
                </p>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{t.ongoingProjects.progress}</span>
                    <span className="font-bold text-brand-green">{project.progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-border-subtle">
                    <div
                      className="h-full rounded-full bg-brand-green transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t.ongoingProjects.lastUpdate}: {project.lastUpdate}
                </p>
                <CardFooter className="mt-4 !p-0">
                  <Button size="sm">{t.ongoingProjects.viewDetails}</Button>
                </CardFooter>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
