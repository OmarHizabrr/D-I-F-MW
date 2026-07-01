import { randomUUID } from "crypto";
import { getAdminFirestore } from "@/lib/firebase/admin";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function createPortalSession(donorId: string): Promise<string> {
  const token = randomUUID();
  const db = getAdminFirestore();
  await db.doc(`portal_sessions/${token}`).set({
    donorId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  });
  return token;
}

export async function verifyPortalSession(token: string | null | undefined): Promise<string | null> {
  if (!token?.trim()) return null;
  const db = getAdminFirestore();
  const snap = await db.doc(`portal_sessions/${token.trim()}`).get();
  if (!snap.exists) return null;
  const data = snap.data();
  const expiresAt = data?.expiresAt as string | undefined;
  if (!expiresAt || new Date(expiresAt) < new Date()) return null;
  const donorId = data?.donorId as string | undefined;
  return donorId ?? null;
}
