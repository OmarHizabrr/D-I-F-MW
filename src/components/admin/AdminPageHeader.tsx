"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getPublicPreviewForAdmin } from "@/lib/admin/admin-public-routes";
import { AdminPreviewLink } from "@/components/admin/AdminPreviewLink";

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** يتجاوز الرابط التلقائي من مسار الصفحة */
  previewHref?: string | null;
  previewLabel?: string;
}

export function AdminPageHeader({
  title,
  description,
  actions,
  previewHref,
  previewLabel,
}: AdminPageHeaderProps) {
  const pathname = usePathname();
  const resolvedPreview =
    previewHref !== undefined ? previewHref : getPublicPreviewForAdmin(pathname);

  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-brand-green-dark dark:text-brand-green sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {(resolvedPreview || actions) && (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
          {resolvedPreview && (
            <AdminPreviewLink href={resolvedPreview} label={previewLabel} />
          )}
          {actions}
        </div>
      )}
    </div>
  );
}
