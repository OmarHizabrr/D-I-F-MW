"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { HOME_SECTIONS } from "@/lib/firebase/database-structure";
import { cn } from "@/lib/utils";

const dashboardLink = {
  label: "لوحة التحكم",
  href: "/admin",
};

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-e border-border-subtle bg-surface">
      <div className="border-b border-border-subtle px-5 py-6">
        <Link href="/admin" className="block">
          <p className="text-xs font-medium text-muted-foreground">مؤسسة D.I.F</p>
          <p className="text-lg font-bold text-brand-green-dark dark:text-brand-green">
            لوحة الإدارة
          </p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          <li>
            <Link
              href={dashboardLink.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(dashboardLink.href)
                  ? "bg-brand-green/10 text-brand-green-dark dark:text-brand-green"
                  : "text-foreground/80 hover:bg-brand-green/5 hover:text-brand-green-dark dark:hover:text-brand-green"
              )}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              {dashboardLink.label}
            </Link>
          </li>
        </ul>

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          أقسام الموقع
        </p>
        <ul className="space-y-1">
          {HOME_SECTIONS.map((section) => (
            <li key={section.id}>
              <Link
                href={section.href}
                className={cn(
                  "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(section.href)
                    ? "bg-brand-green/10 text-brand-green-dark dark:text-brand-green"
                    : "text-foreground/80 hover:bg-brand-green/5 hover:text-brand-green-dark dark:hover:text-brand-green"
                )}
              >
                {section.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
