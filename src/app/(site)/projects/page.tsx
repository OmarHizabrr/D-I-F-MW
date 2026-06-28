"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { useLocale } from "@/context/LocaleContext";
import { PROJECT_STATUS_LABELS } from "@/lib/project-status";
import type { LocaleCode, ProjectStatus } from "@/types/cms";
import { cn } from "@/lib/utils";

const statusFilterKeys: Array<"all" | ProjectStatus> = [
  "all",
  "ongoing",
  "completed",
  "delayed",
  "needs_update",
];

function ProjectsContent() {
  const { projects, programs, sectionTitles, text, loading } = useSiteContent();
  const { locale, t } = useLocale();
  const searchParams = useSearchParams();
  const programFilter = searchParams.get("program") ?? "all";
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");

  const programItems = useMemo(
    () => programs.filter((p) => p.enabled).sort((a, b) => a.order - b.order),
    [programs]
  );

  const items = useMemo(() => {
    let list = projects.filter((p) => p.enabled).sort((a, b) => a.order - b.order);
    if (programFilter !== "all") {
      list = list.filter((p) => p.programId === programFilter);
    }
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }
    return list;
  }, [projects, programFilter, statusFilter]);

  const activeProgram = programItems.find((p) => p.id === programFilter);

  if (loading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  return (
    <>
      <SitePageHeader
        title={text(sectionTitles.projects)}
        subtitle={
          activeProgram
            ? text(activeProgram.title)
            : text(sectionTitles.projectsSubtitle)
        }
        breadcrumbs={[{ label: text(sectionTitles.projects) }]}
      />
      <div className="section-padding bg-background">
        <div className="container-dif">
          <div className="mb-4 flex flex-wrap gap-2">
            <a
              href="/projects"
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm",
                programFilter === "all"
                  ? "bg-brand-green text-white"
                  : "bg-border-subtle text-muted-foreground hover:text-foreground"
              )}
            >
              {text(sectionTitles.navAllProjects)}
            </a>
            {programItems.map((program) => (
              <a
                key={program.id}
                href={`/projects?program=${program.id}`}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm",
                  programFilter === program.id
                    ? "bg-brand-green text-white"
                    : "bg-border-subtle text-muted-foreground hover:text-foreground"
                )}
              >
                {text(program.title)}
              </a>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {statusFilterKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm",
                  statusFilter === key
                    ? "bg-brand-brown text-white"
                    : "bg-border-subtle text-muted-foreground hover:text-foreground"
                )}
              >
                {key === "all"
                  ? t.common.filterAll
                  : PROJECT_STATUS_LABELS[key][locale as LocaleCode] ?? key}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">{t.common.noProjects}</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="section-padding">
          <SitePageSkeleton />
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
