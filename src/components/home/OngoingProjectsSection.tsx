"use client";

import Link from "next/link";
import { useSiteContent } from "@/context/SiteContentContext";
import { useMergedPublicProjects } from "@/hooks/useMergedPublicProjects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";

const HOME_LIMIT = 4;

export function OngoingProjectsSection() {
  const { sectionTitles, text } = useSiteContent();
  const { projects } = useMergedPublicProjects();

  const ongoing = projects
    .filter((p) => p.status === "ongoing")
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
            <Reveal key={`${project.source}-${project.id}`} delay={i * 60}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
