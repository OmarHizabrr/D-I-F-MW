/**
 * تطبيع روابط الموقع الداخلية:
 * - `#programs` → `/projects` (أو صفحة مخصّصة)
 * - `#programs#programs` → إصلاح التكرار
 * - `#section` → `/#section` عندما لا توجد صفحة مستقلة
 */

const FRAGMENT_TO_PAGE: Record<string, string> = {
  program: "/projects",
  programs: "/projects",
  projects: "/projects",
  news: "/news",
  events: "/events",
  media: "/media",
  volunteer: "/volunteer",
  faq: "/faq",
  resources: "/resources",
  "our-work": "/our-work",
  "success-stories": "/success-stories",
  reports: "/resources",
  trust: "/transparency",
  home: "/",
};

function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:|sms:)/i.test(href);
}

function resolveFragment(fragment: string): string {
  const key = fragment.trim().toLowerCase();
  if (!key) return "/";
  return FRAGMENT_TO_PAGE[key] ?? `/#${key}`;
}

/** يزيل التكرار في الـ hash ويُرجع مساراً داخلياً صالحاً */
export function normalizeSiteHref(href: string | undefined | null): string {
  const raw = href?.trim();
  if (!raw) return "/";
  if (raw === "#") return "#";
  if (isExternalHref(raw)) return raw;

  const hashIndex = raw.indexOf("#");
  if (hashIndex === -1) {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }

  const pathPart = raw.slice(0, hashIndex);
  const fragment = raw
    .slice(hashIndex + 1)
    .split("#")
    .map((part) => part.trim())
    .filter(Boolean)
    .pop();

  if (!fragment) {
    if (!pathPart) return "/";
    return pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  }

  if (!pathPart || pathPart === "/") {
    return resolveFragment(fragment);
  }

  const path = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  return `${path}#${fragment}`;
}
