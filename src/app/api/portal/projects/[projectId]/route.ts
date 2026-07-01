import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { getDonorProjectIfAllowed } from "@/lib/portal/portal-projects-server";
import { verifyPortalSession } from "@/lib/portal/portal-session-server";
import { PHOTO_PHASES, PROJECT_SUBCOLLECTIONS } from "@/types/project-management";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  const sessionToken = request.headers.get("x-portal-session");
  const donorId = await verifyPortalSession(sessionToken);
  if (!donorId) {
    return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
  }

  const project = await getDonorProjectIfAllowed(donorId, projectId);
  if (!project) {
    return NextResponse.json({ error: "لا يمكن الوصول لهذا المشروع" }, { status: 403 });
  }

  const db = getAdminFirestore();
  const root = db.collection("projects").doc(projectId);

  const photosEntries = await Promise.all(
    PHOTO_PHASES.map(async (phase) => {
      const snap = await root.collection("Photos").doc(phase).collection(phase).get();
      return [
        phase,
        snap.docs.map((d) => ({ id: d.id, ...d.data(), phase })),
      ] as const;
    })
  );

  const loadSub = async (name: string) => {
    const snap = await root.collection(name).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  const [locationSnap, beneficiariesSnap, financialSnap, ratingSnap] = await Promise.all([
    root.collection(PROJECT_SUBCOLLECTIONS.location).doc("main").get(),
    root.collection(PROJECT_SUBCOLLECTIONS.beneficiaries).doc("main").get(),
    root.collection(PROJECT_SUBCOLLECTIONS.progress).doc("financial").get(),
    root.collection(PROJECT_SUBCOLLECTIONS.donorRatings).doc(donorId).get(),
  ]);

  const [updates, videos, timeline, reports, contracts, invoices] = await Promise.all([
    loadSub(PROJECT_SUBCOLLECTIONS.updates),
    loadSub(PROJECT_SUBCOLLECTIONS.videos),
    loadSub(PROJECT_SUBCOLLECTIONS.timeline),
    loadSub(PROJECT_SUBCOLLECTIONS.reports),
    loadSub(PROJECT_SUBCOLLECTIONS.contracts),
    loadSub(PROJECT_SUBCOLLECTIONS.invoices),
  ]);

  return NextResponse.json({
    project,
    updates,
    videos,
    timeline,
    reports,
    contracts,
    invoices,
    photos: Object.fromEntries(photosEntries),
    location: locationSnap.exists ? locationSnap.data() : null,
    beneficiaries: beneficiariesSnap.exists ? beneficiariesSnap.data() : null,
    financial: financialSnap.exists ? financialSnap.data() : null,
    existingRating: ratingSnap.exists ? { id: ratingSnap.id, ...ratingSnap.data() } : null,
  });
}
