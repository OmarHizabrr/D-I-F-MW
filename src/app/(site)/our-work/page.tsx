"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";

export default function OurWorkPage() {
  const { projects, sectionTitles, text, loading } = useSiteContent();
  const items = projects
    .filter((p) => p.enabled && (p.featured || p.status === "completed"))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);

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
        title={text(sectionTitles.ourWorkPageTitle)}
        subtitle={text(sectionTitles.ourWorkPageSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.ourWorkPageTitle) }]}
      />
      <div className="section-padding bg-background">
        <div className="container-dif">
          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">لا توجد أعمال معروضة حالياً</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
