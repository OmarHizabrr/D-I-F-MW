import type { LocalizedString } from "@/types/cms";

export function pickAdminLabel(
  value: LocalizedString | undefined,
  fallback = "—"
): string {
  if (!value) return fallback;
  return value.ar || value.en || value.ny || fallback;
}
