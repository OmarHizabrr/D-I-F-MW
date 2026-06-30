import type { OrgProject } from "@/types/project-management";
import { projectBelongsToDonor } from "@/lib/admin/form-placeholders";

export { projectBelongsToDonor };

export function filterDonorProjects(projects: OrgProject[], donorId: string): OrgProject[] {
  return projects.filter((p) => !p.isArchived && projectBelongsToDonor(p, donorId));
}
