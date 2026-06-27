import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import FirestoreApi, { type UserMeta } from "@/services/firestoreApi";
import { resolveFirebaseConfig, isFirebaseConfigResolved } from "@/lib/firebase/config";
import type { AppUser, UserRole } from "@/types/user";
import { isAdminRole } from "@/types/user";

const api = FirestoreApi.Api;

function toAppUser(uid: string, data: Record<string, unknown> | null): AppUser | null {
  if (!data) return null;
  return {
    id: uid,
    uid,
    email: (data.email as string) || "",
    displayName: (data.displayName as string) || "",
    phone: (data.phone as string) || "",
    photoURL: (data.photoURL as string) || "",
    role: (data.role as UserRole) || "member",
    active: data.active !== false,
    profileComplete: Boolean(data.profileComplete),
    banned: Boolean(data.banned),
    createdAt: data.createdAt as string | undefined,
    updatedAt: data.updatedAt as string | undefined,
  };
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const data = await api.getData(api.getUserDoc(uid));
  return toAppUser(uid, data as Record<string, unknown> | null);
}

export async function saveUserProfile(
  uid: string,
  patch: Partial<AppUser>,
  userData: UserMeta = {}
) {
  await api.setData({
    docRef: api.getUserDoc(uid),
    data: {
      id: uid,
      uid,
      updatedAt: new Date().toISOString(),
      ...patch,
    },
    userData: { ...userData, uid },
  });
}

/** تسجيل مدير بعد الدخول بالبريد — يُسمح فقط لحسابات مُسجّلة مسبقاً كمدير */
export async function registerAdminUser(
  uid: string,
  email: string,
  userData: UserMeta = {}
) {
  const existing = await getUserProfile(uid);
  if (!existing || !isAdminRole(existing.role)) {
    throw new Error("NOT_ADMIN");
  }
  if (existing.banned) {
    throw new Error("BANNED");
  }
  if (!existing.active) {
    throw new Error("USER_DISABLED");
  }

  await saveUserProfile(
    uid,
    {
      email,
      displayName: userData.displayName || existing.displayName || email,
      photoURL: userData.photoURL || existing.photoURL || "",
      phone: existing.phone || "",
      role: existing.role,
      active: existing.active,
      profileComplete: existing.profileComplete,
      banned: false,
      createdAt: existing.createdAt || new Date().toISOString(),
    },
    userData
  );
}

/** تسجيل مستخدم عام (Google) لمشاركة الرأي */
export async function registerPublicUser(
  uid: string,
  email: string,
  displayName: string,
  photoURL: string
) {
  const existing = await getUserProfile(uid);
  if (existing?.banned) {
    throw new Error("BANNED");
  }
  await saveUserProfile(uid, {
    email,
    displayName: displayName || email,
    photoURL: photoURL || existing?.photoURL || "",
    phone: existing?.phone || "",
    role: existing?.role || "member",
    active: true,
    profileComplete: true,
    banned: false,
    createdAt: existing?.createdAt || new Date().toISOString(),
  });
}

export async function completeAdminProfile(
  uid: string,
  data: { displayName: string; phone: string; photoURL?: string },
  userData: UserMeta = {}
) {
  await saveUserProfile(
    uid,
    {
      displayName: data.displayName.trim(),
      phone: data.phone.trim(),
      photoURL: data.photoURL || "",
      profileComplete: true,
    },
    userData
  );
}

export async function listAllUsers(): Promise<AppUser[]> {
  const docs = await api.getDocuments(api.getUsersCollection());
  return docs.map((d) => toAppUser(d.id, d.data() as Record<string, unknown>)).filter(Boolean) as AppUser[];
}

export async function createAdminAccount(
  email: string,
  password: string,
  actor: UserMeta = {}
): Promise<string> {
  const config = resolveFirebaseConfig();
  if (!isFirebaseConfigResolved(config)) {
    throw new Error("Firebase is not configured.");
  }

  const secondaryApp = initializeApp(config, `Secondary_${Date.now()}`);
  try {
    const auth = getAuth(secondaryApp);
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    await saveUserProfile(
      uid,
      {
        email,
        displayName: email.split("@")[0],
        phone: "",
        photoURL: "",
        role: "admin",
        active: true,
        profileComplete: false,
        banned: false,
        createdAt: new Date().toISOString(),
      },
      actor
    );

    return uid;
  } finally {
    await deleteApp(secondaryApp);
  }
}

export async function setUserBanned(uid: string, banned: boolean, actor: UserMeta = {}) {
  await api.updateData({
    docRef: api.getUserDoc(uid),
    data: { banned, updatedAt: new Date().toISOString() },
    userData: actor,
  });
}

export async function setUserActive(uid: string, active: boolean, actor: UserMeta = {}) {
  await api.updateData({
    docRef: api.getUserDoc(uid),
    data: { active, updatedAt: new Date().toISOString() },
    userData: actor,
  });
}
