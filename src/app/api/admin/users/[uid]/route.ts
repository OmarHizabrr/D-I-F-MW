import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin";
import { verifySuperAdmin, unauthorizedResponse } from "@/lib/api/verify-superadmin";
import type { UserRole } from "@/types/user";

const USERS_DOC_PATH = "users/global/users";

type PatchBody = {
  displayName?: string;
  phone?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
  banned?: boolean;
  jobTitle?: string;
  department?: string;
};

async function countSuperadmins(excludeUid?: string): Promise<number> {
  const snap = await getAdminFirestore().collection(`${USERS_DOC_PATH}`).get();
  return snap.docs.filter((d) => {
    if (excludeUid && d.id === excludeUid) return false;
    const data = d.data();
    return data.role === "superadmin" && data.active !== false && data.banned !== true;
  }).length;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const actor = await verifySuperAdmin(request);
  if (!actor) return unauthorizedResponse();

  const { uid } = await params;
  const body = (await request.json()) as PatchBody;

  const userRef = getAdminFirestore().doc(`${USERS_DOC_PATH}/${uid}`);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return Response.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  const current = userSnap.data()!;
  const nextRole = body.role ?? current.role;

  if (current.role === "superadmin" && nextRole !== "superadmin") {
    const others = await countSuperadmins(uid);
    if (others === 0) {
      return Response.json(
        { error: "لا يمكن تغيير دور آخر مدير عام في النظام" },
        { status: 400 }
      );
    }
  }

  const authUpdate: {
    email?: string;
    displayName?: string;
    disabled?: boolean;
  } = {};

  if (body.email !== undefined) authUpdate.email = body.email.trim();
  if (body.displayName !== undefined) authUpdate.displayName = body.displayName.trim();
  if (body.active !== undefined) authUpdate.disabled = !body.active;

  if (Object.keys(authUpdate).length > 0) {
    try {
      await getAdminAuth().updateUser(uid, authUpdate);
    } catch (err) {
      const message = err instanceof Error ? err.message : "فشل تحديث Firebase Auth";
      return Response.json({ error: message }, { status: 400 });
    }
  }

  const firestorePatch: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
    updateBy: actor.uid,
  };

  if (body.displayName !== undefined) firestorePatch.displayName = body.displayName.trim();
  if (body.phone !== undefined) firestorePatch.phone = body.phone.trim();
  if (body.email !== undefined) firestorePatch.email = body.email.trim();
  if (body.role !== undefined) firestorePatch.role = body.role;
  if (body.active !== undefined) firestorePatch.active = body.active;
  if (body.banned !== undefined) firestorePatch.banned = body.banned;
  if (body.jobTitle !== undefined) firestorePatch.jobTitle = body.jobTitle;
  if (body.department !== undefined) firestorePatch.department = body.department;

  await userRef.update(firestorePatch);

  return Response.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const actor = await verifySuperAdmin(request);
  if (!actor) return unauthorizedResponse();

  const { uid } = await params;

  if (uid === actor.uid) {
    return Response.json({ error: "لا يمكنك حذف حسابك أثناء تسجيل الدخول" }, { status: 400 });
  }

  const userRef = getAdminFirestore().doc(`${USERS_DOC_PATH}/${uid}`);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return Response.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  const data = userSnap.data()!;
  if (data.role === "superadmin") {
    const others = await countSuperadmins(uid);
    if (others === 0) {
      return Response.json({ error: "لا يمكن حذف آخر مدير عام" }, { status: 400 });
    }
  }

  try {
    await getAdminAuth().deleteUser(uid);
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code !== "auth/user-not-found") {
      const message = err instanceof Error ? err.message : "فشل حذف الحساب";
      return Response.json({ error: message }, { status: 400 });
    }
  }

  await userRef.delete();

  return Response.json({ ok: true });
}
