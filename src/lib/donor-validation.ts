import type { Donor } from "@/types/project-management";

export type DonorValidationResult = { ok: true } | { ok: false; message: string };

export function validateDonorForSave(
  donor: Pick<Donor, "fullName" | "portalEnabled" | "portalUsername" | "portalPin" | "status">
): DonorValidationResult {
  if (!donor.fullName?.trim()) {
    return { ok: false, message: "اسم المتبرع مطلوب" };
  }
  if (donor.portalEnabled) {
    const username = donor.portalUsername?.trim().toLowerCase();
    const pin = donor.portalPin?.trim();
    if (!username || username.length < 3) {
      return { ok: false, message: "اسم المستخدم مطلوب (3 أحرف على الأقل) عند تفعيل البوابة" };
    }
    if (!pin || pin.length < 4) {
      return { ok: false, message: "الرمز السري مطلوب (4 أرقام على الأقل) عند تفعيل البوابة" };
    }
  }
  return { ok: true };
}
