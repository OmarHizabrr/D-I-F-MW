import type { Donor } from "@/types/project-management";

export async function loginDonorWithCredentials(
  username: string,
  pin: string
): Promise<{ ok: true; donor: Donor } | { ok: false; message: string }> {
  const res = await fetch("/api/portal/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, pin }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
    donor?: Donor;
  };

  if (!res.ok) {
    return { ok: false, message: body.error ?? "فشل تسجيل الدخول" };
  }

  if (!body.donor?.id) {
    return { ok: false, message: "استجابة غير صالحة" };
  }

  return { ok: true, donor: body.donor };
}
