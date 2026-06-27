"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export function ProjectsTableSection() {
  const { projects, sectionTitles, text } = useSiteContent();

  const tableData = projects
    .filter((p) => p.enabled)
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      id: p.code || p.id,
      name: text(p.name),
      country: text(p.country),
      progress: `${p.progress}%`,
      lastUpdate: p.lastUpdate,
    }));

  return (
    <section id="achievements" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.projects)}
          subtitle={text(sectionTitles.projectsSubtitle)}
        />
        <Table
          title={text(sectionTitles.projects)}
          printable
          columns={[
            { key: "id", header: "#" },
            { key: "name", header: text(sectionTitles.projectsTableName) },
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
