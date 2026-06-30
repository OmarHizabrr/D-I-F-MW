"use client";

import Link from "next/link";
import { useSiteContent } from "@/context/SiteContentContext";
import { useMergedPublicProjects } from "@/hooks/useMergedPublicProjects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export function ProjectsTableSection() {
  const { sectionTitles, text } = useSiteContent();
  const { projects } = useMergedPublicProjects();

  const tableData = projects.map((p) => ({
    projectId: p.id,
    id: p.code || p.id,
    name: p.name,
    country: p.country,
    progress: `${p.progress}%`,
    lastUpdate: p.lastUpdate ?? "—",
  }));

  return (
    <section id="achievements" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.projects)}
          subtitle={text(sectionTitles.projectsSubtitle)}
          viewAllHref="/projects"
          viewAllLabel={text(sectionTitles.viewAll)}
        />
        <Table
          title={text(sectionTitles.projects)}
          printable
          columns={[
            { key: "id", header: "#" },
            {
              key: "name",
              header: text(sectionTitles.projectsTableName),
              render: (row) => (
                <Link
                  href={`/projects/${row.projectId as string}`}
                  className="font-medium text-brand-green hover:underline"
                >
                  {row.name as string}
                </Link>
              ),
            },
            { key: "country", header: text(sectionTitles.projectsCountry) },
            {
              key: "progress",
              header: text(sectionTitles.projectsProgress),
              render: (row) => (
                <Badge variant={parseInt(row.progress as string) >= 80 ? "success" : "default"}>
                  {row.progress as string}
                </Badge>
              ),
            },
            { key: "lastUpdate", header: text(sectionTitles.projectsLastUpdate) },
          ]}
          data={tableData}
        />
      </div>
    </section>
  );
}
