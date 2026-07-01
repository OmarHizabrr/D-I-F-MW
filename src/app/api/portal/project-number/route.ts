import { getAdminFirestore } from "@/lib/firebase/admin";
import { sanitizeDonorForClient } from "@/lib/portal/donor-sanitize";
import { createPortalSession } from "@/lib/portal/portal-session-server";
import type { Donor, OrgProject } from "@/types/project-management";

function donorFromSnap(id: string, data: Record<string, unknown>): Donor {
  return { id, ...data } as Donor;
}

function isPortalActive(donor: Donor): boolean {
  return donor.status === "active" && donor.portalEnabled === true;
}

export async function POST(request: Request) {
  let body: { projectNumber?: string };
  try {
    body = (await request.json()) as { projectNumber?: string };
  } catch {
    return Response.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const projectNumber = body.projectNumber?.trim();
  if (!projectNumber) {
    return Response.json({ error: "رقم المشروع مطلوب" }, { status: 400 });
  }

  const db = getAdminFirestore();
  const projectsSnap = await db
    .collection("projects")
    .where("projectNumber", "==", projectNumber)
    .limit(1)
    .get();

  if (projectsSnap.empty) {
    return Response.json({ error: "رقم المشروع غير موجود" }, { status: 404 });
  }

  const projectDoc = projectsSnap.docs[0];
  const project = { id: projectDoc.id, ...projectDoc.data() } as OrgProject;
  if (!project.donorId) {
    return Response.json({ error: "لا يوجد متبرع رئيسي لهذا المشروع" }, { status: 404 });
  }

  const donorSnap = await db.doc(`donors/${project.donorId}`).get();
  if (!donorSnap.exists) {
    return Response.json({ error: "حساب المتبرع غير موجود" }, { status: 404 });
  }

  const donor = donorFromSnap(donorSnap.id, donorSnap.data() as Record<string, unknown>);
  if (!isPortalActive(donor)) {
    return Response.json({ error: "البوابة غير مفعّلة لهذا المتبرع" }, { status: 403 });
  }

  return Response.json({
    donor: sanitizeDonorForClient(donor),
    projectId: project.id,
    sessionToken: await createPortalSession(donor.id),
  });
}
