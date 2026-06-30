import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { normalizeDonorEmail } from "@/lib/donor-email";
import { DEFAULT_PERMISSIONS } from "@/types/project-management";
import type { Donor, OrgProject } from "@/types/project-management";

const USERS_DOC_PATH = "users/global/users";

function toDonor(id: string, data: Record<string, unknown>): Donor {
  return { id, ...data } as Donor;
}

async function findDonorByLinkedUserId(uid: string): Promise<Donor | null> {
  const db = getAdminFirestore();
  const snap = await db.collection("donors").where("linkedUserId", "==", uid).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return toDonor(doc.id, doc.data());
}

async function findDonorByEmail(email: string): Promise<Donor | null> {
  const db = getAdminFirestore();
  const trimmed = email.trim();
  if (!trimmed) return null;

  const normalized = normalizeDonorEmail(trimmed);
  for (const candidate of [normalized, trimmed]) {
    const snap = await db.collection("donors").where("email", "==", candidate).limit(1).get();
    if (!snap.empty) {
      const doc = snap.docs[0];
      return toDonor(doc.id, doc.data());
    }
  }

  return null;
}

async function promoteUserToDonor(uid: string, displayName?: string): Promise<void> {
  const db = getAdminFirestore();
  const userRef = db.doc(`${USERS_DOC_PATH}/${uid}`);
  const snap = await userRef.get();
  const existing = snap.data();
  const role = existing?.role;
  const nextRole =
    role === "superadmin" || role === "admin" ? role : "donor";

  await userRef.set(
    {
      role: nextRole,
      displayName: existing?.displayName || displayName || existing?.email || "",
      active: true,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

async function syncDonorGroupMemberships(donorId: string, userId: string): Promise<void> {
  const db = getAdminFirestore();
  const projectsSnap = await db.collection("projects").get();
  const now = new Date().toISOString();

  for (const projectDoc of projectsSnap.docs) {
    const project = { id: projectDoc.id, ...projectDoc.data() } as OrgProject;
    const isPrimary = project.donorId === donorId;
    const isAdditional = (project.additionalDonorIds ?? []).includes(donorId);
    if (!isPrimary && !isAdditional) continue;
    if (!project.groupId) continue;

    const memberRef = db.doc(`members/${project.groupId}/members/${userId}`);
    const memberSnap = await memberRef.get();
    if (memberSnap.exists) continue;

    const groupSnap = await db.doc(`groups/${project.groupId}`).get();
    const groupName =
      (groupSnap.data()?.groupName as string | undefined) ??
      `فريق ${project.projectName}`;

    const member = {
      userId,
      groupId: project.groupId,
      role: "Donor",
      title: "متبرع",
      permissions: DEFAULT_PERMISSIONS.Donor,
      status: "active",
      joinedAt: now,
      addedBy: userId,
      isOwner: false,
    };

    await memberRef.set(member);

    await db.doc(`MyGroups/${userId}/MyGroups/${project.groupId}`).set({
      groupId: project.groupId,
      projectId: project.id,
      projectName: project.projectName,
      projectNumber: project.projectNumber,
      groupName,
      role: "Donor",
      joinedAt: now,
      status: "active",
      lastActivity: now,
    });

    await db.doc(`groups/${project.groupId}`).update({
      membersCount: FieldValue.increment(1),
    });

    const notificationRef = db.collection("notifications").doc();
    await notificationRef.set({
      id: notificationRef.id,
      userId,
      title: "مشروع جديد للمتابعة",
      body: `يمكنك الآن متابعة مشروع «${project.projectName}»`,
      type: "project_started",
      projectId: project.id,
      groupId: project.groupId,
      read: false,
      createdAt: now,
    });
  }
}

export type ResolveDonorResult =
  | { ok: true; donor: Donor; linked: boolean }
  | { ok: false; status: number; error: string };

export async function resolveDonorForAuthUser(
  uid: string,
  email: string,
  displayName?: string
): Promise<ResolveDonorResult> {
  let donor = await findDonorByLinkedUserId(uid);
  let linked = false;

  if (!donor && email) {
    donor = await findDonorByEmail(email);
    if (donor) {
      if (donor.linkedUserId && donor.linkedUserId !== uid) {
        return {
          ok: false,
          status: 409,
          error: "هذا المتبرع مرتبط بحساب Google آخر. تواصل مع الإدارة.",
        };
      }
      linked = true;
      const db = getAdminFirestore();
      await db.doc(`donors/${donor.id}`).update({
        linkedUserId: uid,
        portalEnabled: true,
        email: normalizeDonorEmail(donor.email || email),
        updatedAt: new Date().toISOString(),
      });
      donor = {
        ...donor,
        linkedUserId: uid,
        portalEnabled: true,
        email: normalizeDonorEmail(donor.email || email),
      };
    }
  }

  if (!donor) {
    return {
      ok: false,
      status: 404,
      error:
        "لا يوجد ملف متبرع مرتبط بهذا البريد. تأكد أن الإدارة سجّلت بريدك الإلكتروني نفسه في صفحة المتبرعين.",
    };
  }

  if (donor.status === "inactive") {
    return {
      ok: false,
      status: 403,
      error: "حساب المتبرع غير نشط. تواصل مع الإدارة.",
    };
  }

  if (!donor.portalEnabled) {
    return {
      ok: false,
      status: 403,
      error: "بوابة المتبرع غير مفعّلة لهذا الحساب.",
    };
  }

  await promoteUserToDonor(uid, displayName);
  if (linked || donor.linkedUserId === uid) {
    await syncDonorGroupMemberships(donor.id, uid);
  }

  return { ok: true, donor, linked };
}
