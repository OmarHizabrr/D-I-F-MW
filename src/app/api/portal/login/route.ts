import { getAdminFirestore } from "@/lib/firebase/admin";
import { sanitizeDonorForClient } from "@/lib/portal/donor-sanitize";
import { createPortalSession } from "@/lib/portal/portal-session-server";
import type { Donor } from "@/types/project-management";

function donorFromSnap(id: string, data: Record<string, unknown>): Donor {
  return { id, ...data } as Donor;
}

export async function POST(request: Request) {
  let body: { username?: string; pin?: string };
  try {
    body = (await request.json()) as { username?: string; pin?: string };
  } catch {
    return Response.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const username = body.username?.trim().toLowerCase();
  const pin = body.pin?.trim();
  if (!username || !pin) {
    return Response.json({ error: "اسم المستخدم والرمز مطلوبان" }, { status: 400 });
  }

  const db = getAdminFirestore();
  const accessSnap = await db.doc(`portal_access/${username}`).get();
  if (!accessSnap.exists) {
    return Response.json({ error: "اسم المستخدم أو الرمز غير صحيح" }, { status: 401 });
  }

  const access = accessSnap.data();
  if (access?.pin !== pin) {
    return Response.json({ error: "اسم المستخدم أو الرمز غير صحيح" }, { status: 401 });
  }

  const donorId = access?.donorId as string | undefined;
  if (!donorId) {
    return Response.json({ error: "حساب المتبرع غير موجود" }, { status: 404 });
  }

  const donorSnap = await db.doc(`donors/${donorId}`).get();
  if (!donorSnap.exists) {
    return Response.json({ error: "حساب المتبرع غير موجود" }, { status: 404 });
  }

  const donor = donorFromSnap(donorSnap.id, donorSnap.data() as Record<string, unknown>);
  if (donor.status === "inactive") {
    return Response.json({ error: "حساب المتبرع غير نشط" }, { status: 403 });
  }
  if (!donor.portalEnabled) {
    return Response.json({ error: "بوابة هذا المتبرع غير مفعّلة" }, { status: 403 });
  }

  return Response.json({
    donor: sanitizeDonorForClient(donor),
    sessionToken: await createPortalSession(donor.id),
  });
}
