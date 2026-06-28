"use client";

import { useMemo, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { useLocale } from "@/context/LocaleContext";
import { PROJECT_STATUS_LABELS } from "@/lib/project-status";
import type { LocaleCode, ProjectStatus } from "@/types/cms";
import { cn } from "@/lib/utils";

const filters: Array<{ key: "all" | ProjectStatus; label: string }> = [
  { key: "all", label: "الكل" },
  { key: "ongoing", label: "جاري" },
  { key: "completed", label: "مكتمل" },
  { key: "delayed", label: "متأخر" },
  { key: "needs_update", label: "يحتاج تحديث" },
];

export default function ProjectsPage() {
  const { projects, sectionTitles, text, loading } = useSiteContent();
  const { locale } = useLocale();
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");

  const items = useMemo(() => {
    const list = projects.filter((p) => p.enabled).sort((a, b) => a.order - b.order);
    if (filter === "all") return list;
    return list.filter((p) => p.status === filter);
  }, [projects, filter]);

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
        subtitle={text(sectionTitles.projectsSubtitle)}
      />
      <div className="section-padding bg-background">
        <div className="container-dif">
          <div className="mb-6 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm",
                  filter === f.key
                    ? "bg-brand-green text-white"
                    : "bg-border-subtle text-muted-foreground hover:text-foreground"
                )}
              >
                {f.key === "all"
                  ? f.label
                  : PROJECT_STATUS_LABELS[f.key][locale as LocaleCode] ?? f.label}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">لا توجد مشاريع في هذا القسم</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewDetailsLabel={text(sectionTitles.projectsViewDetails)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
