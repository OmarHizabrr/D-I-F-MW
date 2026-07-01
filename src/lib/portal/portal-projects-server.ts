import { getAdminFirestore } from "@/lib/firebase/admin";
import { projectBelongsToDonor } from "@/lib/donor-project-utils";
import type { OrgProject } from "@/types/project-management";

export async function resolveDonorProjects(donorId: string): Promise<OrgProject[]> {
  const db = getAdminFirestore();
  const snap = await db.collection("projects").get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as OrgProject))
    .filter((p) => !p.isArchived && projectBelongsToDonor(p, donorId));
}

export async function getDonorProjectIfAllowed(
  donorId: string,
  projectId: string
): Promise<OrgProject | null> {
  const db = getAdminFirestore();
  const snap = await db.doc(`projects/${projectId}`).get();
  if (!snap.exists) return null;
  const project = { id: snap.id, ...snap.data() } as OrgProject;
  if (project.isArchived || !projectBelongsToDonor(project, donorId)) return null;
  return project;
}
