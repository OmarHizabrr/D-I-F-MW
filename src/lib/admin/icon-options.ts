import { getAllIconOptions, getCatalogIconLabel } from "@/lib/admin/icon-catalog";

export type { IconCatalogEntry } from "@/lib/admin/icon-catalog";

export type IconOption = ReturnType<typeof getAllIconOptions>[number];

/** كل الأيقونات — للاستخدام في أي قسم */
export const allIconOptions = getAllIconOptions();

/** @deprecated استخدم allIconOptions */
export const statIconOptions = allIconOptions;
export const programIconOptions = allIconOptions;
export const howWeWorkIconOptions = allIconOptions;
export const whyUsIconOptions = allIconOptions;
export const licenseIconOptions = allIconOptions;

export function getIconOptionLabel(_options: IconOption[], key: string) {
  return getCatalogIconLabel(key);
}
