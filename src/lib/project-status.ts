import type { ProjectStatus } from "@/types/cms";

export const PROJECT_STATUS_LABELS: Record<
  ProjectStatus,
  { ar: string; en: string; ny: string }
> = {
  ongoing: { ar: "جاري", en: "Ongoing", ny: "Ikuchitika" },
  completed: { ar: "مكتمل", en: "Completed", ny: "Yamaliza" },
  delayed: { ar: "متأخر", en: "Delayed", ny: "Yachitika" },
  needs_update: { ar: "يحتاج تحديث", en: "Needs update", ny: "Needs update" },
};

export const PROJECT_STATUS_VARIANT: Record<
  ProjectStatus,
  "default" | "success" | "brown" | "outline"
> = {
  ongoing: "default",
  completed: "success",
  delayed: "brown",
  needs_update: "outline",
};
