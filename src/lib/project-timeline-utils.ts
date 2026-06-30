import type { OrgProject, ProjectTimelineEntry } from "@/types/project-management";
import { PROJECT_STATUS_LABELS } from "@/types/project-management";

const TIMELINE_STATUS_LABELS: Record<ProjectTimelineEntry["status"], string> = {
  pending: "قادمة",
  in_progress: "جارية",
  completed: "مكتملة",
  delayed: "متأخرة",
};

export function formatExpectedDuration(startDate: string, endDate: string): string | null {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const days = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
  if (days === 0) return "يوم واحد";
  if (days < 30) return `${days} يومًا`;
  const months = Math.round(days / 30);
  return months === 1 ? "شهر واحد تقريبًا" : `${months} شهرًا تقريبًا`;
}

export function getCurrentTimelinePhase(
  timeline: ProjectTimelineEntry[],
  project: OrgProject
): string {
  const inProgress = timeline.find((t) => t.status === "in_progress");
  if (inProgress?.phase) return inProgress.phase;
  const delayed = timeline.find((t) => t.status === "delayed");
  if (delayed?.phase) return delayed.phase;
  const pending = timeline.find((t) => t.status === "pending");
  if (pending?.phase) return pending.phase;
  const last = timeline[timeline.length - 1];
  if (last?.phase) return last.phase;
  return PROJECT_STATUS_LABELS[project.status] ?? project.status;
}

export function getTimelineStatusLabel(status: ProjectTimelineEntry["status"]): string {
  return TIMELINE_STATUS_LABELS[status];
}

export type ProjectTimelineOverview = {
  startDate: string;
  expectedDuration: string | null;
  currentPhase: string;
  expectedDelivery: string;
};

export function buildTimelineOverview(
  project: OrgProject,
  timeline: ProjectTimelineEntry[]
): ProjectTimelineOverview {
  return {
    startDate: project.startDate,
    expectedDuration: formatExpectedDuration(project.startDate, project.expectedEndDate),
    currentPhase: getCurrentTimelinePhase(timeline, project),
    expectedDelivery: project.expectedEndDate || "—",
  };
}
