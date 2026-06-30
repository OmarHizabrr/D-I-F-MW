import { getAuth } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/client";
import type { AppUser, UserRole, UserDepartment } from "@/types/user";

async function getIdToken(): Promise<string> {
  const user = getAuth(getFirebaseApp()).currentUser;
  if (!user) throw new Error("يجب تسجيل الدخول أولاً");
  return user.getIdToken();
}

async function apiFetch<T>(path: string, init: RequestInit): Promise<T> {
  const token = await getIdToken();
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "فشل الطلب");
  }
  return data as T;
}

export type UpdateUserPayload = {
  displayName?: string;
  phone?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
  banned?: boolean;
  jobTitle?: string;
  department?: UserDepartment;
};

export async function superAdminUpdateUser(uid: string, payload: UpdateUserPayload) {
  return apiFetch<{ ok: true }>(`/api/admin/users/${uid}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function superAdminDeleteUser(uid: string) {
  return apiFetch<{ ok: true }>(`/api/admin/users/${uid}`, {
    method: "DELETE",
  });
}

export async function superAdminChangePassword(uid: string, password: string) {
  return apiFetch<{ ok: true }>(`/api/admin/users/${uid}/password`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function userToEditForm(u: AppUser) {
  return {
    displayName: u.displayName,
    phone: u.phone,
    email: u.email,
    role: u.role,
    active: u.active,
    banned: u.banned,
    jobTitle: u.jobTitle ?? "",
    department: (u.department ?? "") as UserDepartment | "",
  };
}
