"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteContent } from "@/context/SiteContentContext";
import { useDonation } from "@/context/DonationContext";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_VARIANT } from "@/lib/project-status";
import { sectionIcons } from "@/lib/icons";
import type { PublicProject } from "@/lib/public-projects";
import type { LocaleCode } from "@/types/cms";
import { useLocale } from "@/context/LocaleContext";

type ProjectCardProps = {
  project: PublicProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { sectionTitles, donation, text } = useSiteContent();
  const { locale } = useLocale();
  const { openDonation } = useDonation();
  const statusLabel =
    PROJECT_STATUS_LABELS[project.status][locale as LocaleCode] ?? project.status;

  return (
    <Card padding="none" className="group overflow-hidden transition-shadow hover:shadow-lg">
      {project.imageUrl ? (
        <div className="relative h-40 overflow-hidden sm:h-48">
          <Image
            src={project.imageUrl}
            alt={project.name}
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
          <CardTitle className="text-base sm:text-lg">{project.name}</CardTitle>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Badge variant={PROJECT_STATUS_VARIANT[project.status]}>{statusLabel}</Badge>
            {project.source === "org" && (
              <Badge variant="outline" className="text-[10px]">
                مباشر
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {project.country}
          {project.city ? ` · ${project.city}` : ""}
        </p>
        {project.code && (
          <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
            {project.code}
          </p>
        )}
        {project.showDonor && project.donorName && (
          <p className="mt-2 text-xs text-muted-foreground">
            بدعم <span className="font-medium text-foreground">{project.donorName}</span>
          </p>
        )}
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
                openDonation({ projectId: project.id, projectName: project.name })
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
