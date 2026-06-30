export type UserRole = "admin" | "superadmin" | "member" | "donor";

export type UserDepartment =
  | "management"
  | "engineering"
  | "finance"
  | "media"
  | "supervision"
  | "field"
  | "other";

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
  /** حقول إدارة المشاريع */
  jobTitle?: string;
  department?: UserDepartment;
  status?: "active" | "inactive" | "suspended";
  createdAt?: string;
  updatedAt?: string;
};

export function isAdminRole(role?: UserRole | string): boolean {
  return role === "admin" || role === "superadmin";
}

export function isSuperAdminRole(role?: UserRole | string): boolean {
  return role === "superadmin";
}

export function isDonorRole(role?: UserRole | string): boolean {
  return role === "donor";
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const first = [...trimmed][0];
  return first?.toUpperCase() || "?";
}
