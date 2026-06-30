"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { useMergedPublicProjects } from "@/hooks/useMergedPublicProjects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";

const HOME_LIMIT = 4;

export function OurWorkSection() {
  const { sectionTitles, text } = useSiteContent();
  const { projects } = useMergedPublicProjects();

  const items = projects
    .filter((p) => p.featured || p.status === "completed")
    .slice(0, HOME_LIMIT);

  if (!items.length) return null;

  return (
    <section id="our-work" className="section-padding bg-surface">
      <div className="container-dif">
        <Reveal>
          <SectionHeader
            title={text(sectionTitles.ourWork)}
            subtitle={text(sectionTitles.ourWorkSubtitle)}
            viewAllHref="/our-work"
            viewAllLabel={text(sectionTitles.viewAll)}
          />
        </Reveal>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={`${item.source}-${item.id}`} delay={i * 60}>
              <ProjectCard project={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
