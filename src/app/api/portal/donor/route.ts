import { getAdminFirestore } from "@/lib/firebase/admin";
import { sanitizeDonorForClient } from "@/lib/portal/donor-sanitize";
import { verifyPortalSession } from "@/lib/portal/portal-session-server";
import type { Donor } from "@/types/project-management";

function donorFromSnap(id: string, data: Record<string, unknown>): Donor {
  return { id, ...data } as Donor;
}

export async function GET(request: Request) {
  const sessionToken = request.headers.get("x-portal-session");
  const donorId = await verifyPortalSession(sessionToken);
  if (!donorId) {
    return Response.json({ error: "جلسة غير صالحة" }, { status: 401 });
  }

  const db = getAdminFirestore();
  const donorSnap = await db.doc(`donors/${donorId}`).get();
  if (!donorSnap.exists) {
    return Response.json({ error: "حساب غير موجود" }, { status: 404 });
  }

  const donor = donorFromSnap(donorSnap.id, donorSnap.data() as Record<string, unknown>);
  if (donor.status !== "active" || !donor.portalEnabled) {
    return Response.json({ error: "البوابة غير مفعّلة" }, { status: 403 });
  }

  return Response.json({ donor: sanitizeDonorForClient(donor) });
}
