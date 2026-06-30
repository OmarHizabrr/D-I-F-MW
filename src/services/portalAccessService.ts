import FirestoreApi, { type UserMeta } from "@/services/firestoreApi";
import type { PortalAccess } from "@/types/project-management";

const api = FirestoreApi.Api;

export async function getPortalAccess(username: string): Promise<PortalAccess | null> {
  const data = await api.getData(api.getPortalAccessDoc(username));
  return data as PortalAccess | null;
}

export async function removePortalAccess(username: string, user: UserMeta): Promise<void> {
  const normalized = username.trim().toLowerCase();
  if (!normalized) return;
  await api.deleteData(api.getPortalAccessDoc(normalized));
}

export async function syncPortalAccess(
  donorId: string,
  fullName: string,
  username: string | undefined,
  pin: string | undefined,
  enabled: boolean,
  user: UserMeta
): Promise<void> {
  const normalized = username?.trim().toLowerCase();
  if (!normalized) return;

  if (!pin || !enabled) {
    await removePortalAccess(normalized, user);
    return;
  }

  await api.setData({
    docRef: api.getPortalAccessDoc(normalized),
    data: { username: normalized, donorId, pin, fullName },
    merge: false,
    userData: user,
  });
}

/** @deprecated استخدم loginDonorWithCredentials عبر API — لا تقرأ الرمز من العميل */
export async function validatePortalLogin(
  username: string,
  pin: string
): Promise<PortalAccess | null> {
  const access = await getPortalAccess(username.trim().toLowerCase());
  if (!access || access.pin !== pin) return null;
  return access;
}

export function getQrCodeImageUrl(data: string, size = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}
