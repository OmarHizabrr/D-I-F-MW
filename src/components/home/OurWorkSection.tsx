"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";

const HOME_LIMIT = 4;

export function OurWorkSection() {
  const { projects, sectionTitles, text } = useSiteContent();
  const items = projects
    .filter((p) => p.enabled && (p.featured || p.status === "completed"))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
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
            <Reveal key={item.id} delay={i * 60}>
              <ProjectCard
                project={item}
                viewDetailsLabel={text(sectionTitles.projectsViewDetails)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
