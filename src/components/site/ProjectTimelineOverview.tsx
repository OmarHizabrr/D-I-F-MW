"use client";

import { Calendar, Clock, Flag, Truck } from "lucide-react";
import type { OrgProject, ProjectTimelineEntry } from "@/types/project-management";
import {
  buildTimelineOverview,
  getTimelineStatusLabel,
} from "@/lib/project-timeline-utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type ProjectTimelineOverviewProps = {
  project: OrgProject;
  timeline: ProjectTimelineEntry[];
  title: string;
  labels: {
    startDate: string;
    expectedDuration: string;
    currentPhase: string;
    expectedDelivery: string;
  };
};

export function ProjectTimelineOverview({
  project,
  timeline,
  title,
  labels,
}: ProjectTimelineOverviewProps) {
  const overview = buildTimelineOverview(project, timeline);

  const items = [
    { icon: Calendar, label: labels.startDate, value: overview.startDate || "—" },
    { icon: Clock, label: labels.expectedDuration, value: overview.expectedDuration || "—" },
    { icon: Flag, label: labels.currentPhase, value: overview.currentPhase },
    { icon: Truck, label: labels.expectedDelivery, value: overview.expectedDelivery },
  ];

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, value }) => (
          <Card key={label} padding="md" className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-0.5 font-semibold">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      {timeline.length > 0 && (
        <div className="space-y-2">
          {timeline.map((entry, index) => (
            <Card key={entry.id} padding="md">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green/10 text-xs font-bold text-brand-green">
                    {index + 1}
                  </span>
                  <p className="font-semibold">{entry.phase}</p>
                </div>
                <Badge variant="outline">{getTimelineStatusLabel(entry.status)}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {entry.startDate}
                {entry.endDate ? ` → ${entry.endDate}` : ""}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border-subtle">
                <div
                  className="h-full rounded-full bg-brand-green"
                  style={{ width: `${entry.progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{entry.progress}%</p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
