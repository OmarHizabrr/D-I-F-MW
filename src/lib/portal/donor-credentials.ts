/** اقتراح اسم مستخدم للبوابة من اسم المتبرع */
export function suggestPortalUsername(fullName: string): string {
  const normalized = fullName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\u0600-\u06FF]/g, "")
    .slice(0, 28);

  if (normalized.length >= 3) return `donor_${normalized}`;
  return `donor_${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDonorPortalCredentials(donor: {
  portalUsername?: string;
  portalPin?: string;
}): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return [
    "بوابة متابعة المشاريع",
    origin ? `${origin}/portal` : "/portal",
    "",
    `اسم المستخدم: ${donor.portalUsername ?? "—"}`,
    `الرمز السري: ${donor.portalPin ?? "—"}`,
    "",
    "أو استخدم رابط الدخول المباشر من لوحة الإدارة.",
  ].join("\n");
}
