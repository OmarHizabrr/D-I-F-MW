import type { Donor } from "@/types/project-management";

/** Strip secrets before sending donor data to the browser. */
export function sanitizeDonorForClient(donor: Donor): Donor {
  const { portalPin: _pin, ...rest } = donor;
  return { ...rest, portalPin: undefined };
}
