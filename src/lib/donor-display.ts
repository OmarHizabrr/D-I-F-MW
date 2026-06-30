import type { LucideIcon } from "lucide-react";
import { Building2, Landmark, User, Users } from "lucide-react";
import type { Donor, DonorKind } from "@/types/project-management";

export const DONOR_KIND_LABELS: Record<DonorKind, string> = {
  individual: "فرد",
  association: "جمعية",
  organization: "مؤسسة",
  entity: "جهة",
};

export const DONOR_KIND_ICONS: Record<DonorKind, LucideIcon> = {
  individual: User,
  association: Users,
  organization: Building2,
  entity: Landmark,
};

export function resolveDonorKind(donor: Donor): DonorKind {
  if (donor.donorKind) return donor.donorKind;
  if (donor.organization?.trim()) return "organization";
  return "individual";
}

export function donorDisplayName(donor: Donor): string {
  return donor.fullName?.trim() || donor.organization?.trim() || "—";
}
