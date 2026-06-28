"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";
import { useDonation } from "@/context/DonationContext";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_VARIANT } from "@/lib/project-status";
import { sectionIcons } from "@/lib/icons";
import type { ProjectItem } from "@/types/cms";
import type { LocaleCode } from "@/types/cms";

type ProjectCardProps = {
  project: ProjectItem;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { sectionTitles, donation, text } = useSiteContent();
  const { locale } = useLocale();
  const { openDonation } = useDonation();
  const statusLabel = PROJECT_STATUS_LABELS[project.status][locale as LocaleCode] ?? project.status;

  return (
    <Card padding="none" className="group overflow-hidden transition-shadow hover:shadow-lg">
      {project.imageUrl ? (
        <div className="relative h-40 overflow-hidden sm:h-48">
          <Image
            src={project.imageUrl}
            alt={text(project.name)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        <CardFooter className="mt-4 flex flex-col gap-2 !p-0 sm:flex-row">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-xl border border-brand-green px-3.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/5"
          >
            {text(sectionTitles.projectsViewDetails)}
          </Link>
          {donation.enabled && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() =>
                openDonation({ projectId: project.id, projectName: text(project.name) })
              }
            >
              {text(donation.navButtonLabel)}
            </Button>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
