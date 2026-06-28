"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_VARIANT } from "@/lib/project-status";
import { sectionIcons } from "@/lib/icons";
import type { ProjectItem } from "@/types/cms";
import type { LocaleCode } from "@/types/cms";

type ProjectCardProps = {
  project: ProjectItem;
  viewDetailsLabel?: string;
};

export function ProjectCard({ project, viewDetailsLabel = "عرض التفاصيل" }: ProjectCardProps) {
  const { text } = useSiteContent();
  const { locale } = useLocale();
  const statusLabel = PROJECT_STATUS_LABELS[project.status][locale as LocaleCode] ?? project.status;

  return (
    <Card padding="none" className="overflow-hidden">
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
          <Badge variant={PROJECT_STATUS_VARIANT[project.status]}>{statusLabel}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {text(project.country)}
          {project.city ? ` · ${project.city}` : ""}
        </p>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-sm">
            <span>نسبة الإنجاز</span>
            <span className="font-bold text-brand-green">{project.progress}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-border-subtle">
            <div
              className="h-full rounded-full bg-brand-green transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
        <CardFooter className="mt-4 !p-0">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-brand-green px-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark w-full sm:w-auto"
          >
            {viewDetailsLabel}
          </Link>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
