import type { Donor } from "@/types/project-management";

export function isDonorPortalActive(donor: Donor | null | undefined): boolean {
  if (!donor) return false;
  if (donor.status === "inactive") return false;
  return donor.portalEnabled !== false;
}

export const DONOR_PORTAL_DISABLED_MESSAGE =
  "بوابة هذا المتبرع غير مفعّلة. تواصل مع المؤسسة.";

export const DONOR_PORTAL_INACTIVE_MESSAGE = "حساب المتبرع غير نشط.";
