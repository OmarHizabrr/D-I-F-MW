import type { User } from "firebase/auth";
import type { Donor } from "@/types/project-management";

export type ResolveDonorClientResult =
  | { ok: true; donor: Donor; linked: boolean }
  | { ok: false; message: string };

export async function resolveDonorForAuthUser(
  user: User
): Promise<ResolveDonorClientResult> {
  const idToken = await user.getIdToken();
  const res = await fetch("/api/portal/resolve-donor", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
  });

  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
    donor?: Donor;
    linked?: boolean;
  };

  if (!res.ok) {
    return {
      ok: false,
      message: body.error ?? "تعذّر ربط حساب المتبرع",
    };
  }

  if (!body.donor?.id) {
    return { ok: false, message: "استجابة غير صالحة من الخادم" };
  }

  return { ok: true, donor: body.donor, linked: body.linked === true };
}
