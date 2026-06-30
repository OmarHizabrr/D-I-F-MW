import type { DecodedIdToken } from "firebase-admin/auth";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin";

const USERS_DOC_PATH = "users/global/users";

export type AuthenticatedContext = {
  token: DecodedIdToken;
  uid: string;
  email: string;
};

export async function verifyAuthenticatedUser(
  request: Request
): Promise<AuthenticatedContext | null> {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;

  const idToken = header.slice(7).trim();
  if (!idToken) return null;

  try {
    const token = await getAdminAuth().verifyIdToken(idToken);
    const snap = await getAdminFirestore().doc(`${USERS_DOC_PATH}/${token.uid}`).get();
    if (!snap.exists) return null;

    const data = snap.data();
    if (data?.banned === true) return null;
    if (data?.active === false) return null;

    return {
      token,
      uid: token.uid,
      email: (token.email ?? data?.email ?? "").trim(),
    };
  } catch {
    return null;
  }
}

export function authRequiredResponse() {
  return Response.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
}
