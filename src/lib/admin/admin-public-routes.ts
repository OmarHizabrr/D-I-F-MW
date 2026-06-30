import { HOME_SECTIONS, MANAGEMENT_SECTIONS } from "@/lib/firebase/database-structure";

const STATIC_ROUTES: Record<string, string> = {
  "/admin": "/",
  "/admin/sections": "/projects",
};

for (const section of HOME_SECTIONS) {
  const s = section as { href: string; publicHref?: string };
  if (s.publicHref) STATIC_ROUTES[s.href] = s.publicHref;
}

for (const section of MANAGEMENT_SECTIONS) {
  const s = section as { href: string; publicHref?: string };
  if (s.publicHref) STATIC_ROUTES[s.href] = s.publicHref;
}

/** يحوّل مسار لوحة التحكم إلى رابط المعاينة على الموقع العام */
export function getPublicPreviewForAdmin(pathname: string): string | null {
  if (STATIC_ROUTES[pathname]) return STATIC_ROUTES[pathname];

  const mgmtProject = pathname.match(/^\/admin\/management\/projects\/([^/]+)$/);
  if (mgmtProject) return `/projects/${mgmtProject[1]}`;

  return null;
}
