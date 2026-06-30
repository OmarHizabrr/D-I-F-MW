"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTION_LABELS: Record<string, string> = {
  "/admin/management/projects": "المشاريع",
  "/admin/management/donors": "المتبرعون",
  "/admin/management/notifications": "الإشعارات",
  "/admin/management/settings": "إعدادات البوابة",
  "/admin/management/groups": "فرق العمل",
};

function resolveCurrentLabel(pathname: string): string | null {
  if (pathname === "/admin/management") return null;
  if (SECTION_LABELS[pathname]) return SECTION_LABELS[pathname];
  if (/^\/admin\/management\/projects\/[^/]+$/.test(pathname)) return "تفاصيل المشروع";
  return null;
}

type AdminManagementNavProps = {
  className?: string;
};

export function AdminManagementNav({ className }: AdminManagementNavProps) {
  const pathname = usePathname();
  const current = resolveCurrentLabel(pathname);
  if (!current) return null;

  return (
    <nav
      className={cn(
        "mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground",
        className
      )}
      aria-label="مسار التنقل"
    >
      <Link href="/admin" className="transition-colors hover:text-brand-green">
        الرئيسية
      </Link>
      <ChevronLeft className="h-3.5 w-3.5 opacity-50" aria-hidden />
      <Link href="/admin/management" className="transition-colors hover:text-brand-green">
        المشاريع والمتبرعون
      </Link>
      <ChevronLeft className="h-3.5 w-3.5 opacity-50" aria-hidden />
      <span className="font-medium text-foreground">{current}</span>
    </nav>
  );
}
