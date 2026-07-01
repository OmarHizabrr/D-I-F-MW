import { getAdminFirestore } from "@/lib/firebase/admin";
import { getDonorProjectIfAllowed } from "@/lib/portal/portal-projects-server";
import { verifyPortalSession } from "@/lib/portal/portal-session-server";

export async function POST(request: Request) {
  const sessionToken = request.headers.get("x-portal-session");
  const donorId = await verifyPortalSession(sessionToken);
  if (!donorId) {
    return Response.json({ error: "جلسة غير صالحة" }, { status: 401 });
  }

  let body: {
    projectId?: string;
    qualityRating?: number;
    executionRating?: number;
    communicationRating?: number;
    suggestions?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const projectId = body.projectId?.trim();
  if (!projectId) {
    return Response.json({ error: "معرّف المشروع مطلوب" }, { status: 400 });
  }

  const project = await getDonorProjectIfAllowed(donorId, projectId);
  if (!project) {
    return Response.json({ error: "لا يمكن تقييم هذا المشروع" }, { status: 403 });
  }

  const db = getAdminFirestore();
  await db
    .collection("projects")
    .doc(projectId)
    .collection("DonorRatings")
    .doc(donorId)
    .set({
      id: donorId,
      projectId,
      donorId,
      qualityRating: body.qualityRating ?? 5,
      executionRating: body.executionRating ?? 5,
      communicationRating: body.communicationRating ?? 5,
      suggestions: body.suggestions ?? "",
      createdAt: new Date().toISOString(),
    });

  return Response.json({ ok: true });
}
