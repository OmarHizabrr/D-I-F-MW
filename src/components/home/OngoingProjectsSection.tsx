"use client";

import Link from "next/link";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";

const HOME_LIMIT = 4;

export function OngoingProjectsSection() {
  const { projects, sectionTitles, text } = useSiteContent();

  const ongoing = projects
    .filter((p) => p.enabled && p.status === "ongoing")
    .sort((a, b) => a.order - b.order)
    .slice(0, HOME_LIMIT);

  return (
    <section id="projects" className="section-padding bg-surface">
      <div className="container-dif">
        <Reveal>
          <SectionHeader
            title={text(sectionTitles.projects)}
            subtitle={text(sectionTitles.projectsSubtitle)}
            viewAllHref="/projects"
            viewAllLabel={text(sectionTitles.viewAll)}
          />
        </Reveal>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {ongoing.map((project, i) => (
            <Reveal key={project.id} delay={i * 60}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
