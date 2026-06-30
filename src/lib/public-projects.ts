import type { ProjectStatus as CmsProjectStatus } from "@/types/cms";
import type { OrgProject, ProjectStatus as OrgProjectStatus } from "@/types/project-management";

/** مشروع موحّد للعرض على الموقع العام */
export type PublicProject = {
  id: string;
  source: "cms" | "org";
  name: string;
  country: string;
  city: string;
  progress: number;
  status: CmsProjectStatus;
  imageUrl: string;
  code: string;
  donorName?: string;
  showDonor: boolean;
  programId: string;
  order: number;
  featured: boolean;
  description?: string;
  youtubeUrl?: string;
  lastUpdate?: string;
};

export function mapOrgStatusToPublicStatus(status: OrgProjectStatus): CmsProjectStatus {
  switch (status) {
    case "completed":
      return "completed";
    case "on_hold":
      return "delayed";
    case "planning":
    case "in_progress":
      return "ongoing";
    case "draft":
    case "cancelled":
    case "archived":
      return "needs_update";
    default:
      return "ongoing";
  }
}

export function orgProjectToPublic(
  project: OrgProject,
  donorName?: string
): PublicProject {
  return {
    id: project.id,
    source: "org",
    name: project.projectName,
    country: project.country,
    city: project.city,
    progress: project.progress,
    status: mapOrgStatusToPublicStatus(project.status),
    imageUrl: project.coverImage ?? "",
    code: project.projectNumber,
    donorName,
    showDonor: project.showDonorPublic ?? false,
    programId: project.programId ?? "",
    order: project.order ?? 0,
    featured: project.featuredOnHome ?? false,
    description: project.description,
    lastUpdate: project.updatedAt?.slice(0, 10) ?? project.startDate,
  };
}

export function isOrgProjectId(id: string): boolean {
  return id.length >= 16 && !id.startsWith("projects_");
}
