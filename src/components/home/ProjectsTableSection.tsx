"use client";

import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ongoingProjectsData, getLocalized } from "@/data/mock";

export function ProjectsTableSection() {
  const { t, locale } = useLocale();

  const tableData = ongoingProjectsData.map((p) => ({
    id: p.id,
    name: getLocalized(p.name, locale),
    country: getLocalized(p.country, locale),
    progress: `${p.progress}%`,
    lastUpdate: p.lastUpdate,
  }));

  return (
    <section id="achievements" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader
          title={t.ongoingProjects.title}
          subtitle={`${t.common.print} — ${t.ongoingProjects.subtitle}`}
        />
        <Table
          title={t.ongoingProjects.title}
          printable
          columns={[
            { key: "id", header: "#" },
            { key: "name", header: t.nav.projects },
            { key: "country", header: t.ongoingProjects.country },
            {
              key: "progress",
              header: t.ongoingProjects.progress,
              render: (row) => (
                <Badge variant={parseInt(row.progress as string) >= 80 ? "success" : "default"}>
                  {row.progress as string}
                </Badge>
              ),
            },
            { key: "lastUpdate", header: t.ongoingProjects.lastUpdate },
          ]}
          data={tableData}
        />
      </div>
    </section>
  );
}
