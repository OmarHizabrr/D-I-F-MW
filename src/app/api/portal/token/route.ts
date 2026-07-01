import { getAdminFirestore } from "@/lib/firebase/admin";
import { sanitizeDonorForClient } from "@/lib/portal/donor-sanitize";
import { createPortalSession } from "@/lib/portal/portal-session-server";
import type { Donor } from "@/types/project-management";

function donorFromSnap(id: string, data: Record<string, unknown>): Donor {
  return { id, ...data } as Donor;
}

function isPortalActive(donor: Donor): boolean {
  return donor.status === "active" && donor.portalEnabled === true;
}

export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = (await request.json()) as { token?: string };
  } catch {
    return Response.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token) {
    return Response.json({ error: "الرابط غير صالح" }, { status: 400 });
  }

  const db = getAdminFirestore();
  const tokenSnap = await db.doc(`portal_tokens/${token}`).get();
  let donorId: string | undefined;

  if (tokenSnap.exists) {
    donorId = tokenSnap.data()?.donorId as string | undefined;
  } else {
    const donorsSnap = await db
      .collection("donors")
      .where("secureLinkToken", "==", token)
      .limit(1)
      .get();
    if (!donorsSnap.empty) {
      donorId = donorsSnap.docs[0].id;
    }
  }

  if (!donorId) {
    return Response.json({ error: "رابط غير صالح أو منتهي" }, { status: 401 });
  }

  const donorSnap = await db.doc(`donors/${donorId}`).get();
  if (!donorSnap.exists) {
    return Response.json({ error: "حساب المتبرع غير موجود" }, { status: 404 });
  }

  const donor = donorFromSnap(donorSnap.id, donorSnap.data() as Record<string, unknown>);
  if (!isPortalActive(donor)) {
    return Response.json({ error: "البوابة غير مفعّلة لهذا المتبرع" }, { status: 403 });
  }

  return Response.json({
    donor: sanitizeDonorForClient(donor),
    sessionToken: await createPortalSession(donor.id),
  });
}
