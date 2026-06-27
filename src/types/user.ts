export type UserRole = "admin" | "superadmin" | "member";

export type AppUser = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  photoURL: string;
  role: UserRole;
  active: boolean;
  profileComplete: boolean;
  banned: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export function isAdminRole(role?: UserRole | string): boolean {
  return role === "admin" || role === "superadmin";
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const first = [...trimmed][0];
  return first?.toUpperCase() || "?";
}
