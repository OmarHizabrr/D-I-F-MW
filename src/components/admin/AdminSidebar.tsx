"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PanelTop,
  Menu,
  Sparkles,
  BarChart3,
  Layers,
  FolderKanban,
  Workflow,
  Shield,
  Images,
  Newspaper,
  Handshake,
  MessageSquare,
  FileBadge,
  MapPin,
  Mail,
  PanelBottom,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";
import { HOME_SECTIONS } from "@/lib/firebase/database-structure";
import { cn } from "@/lib/utils";

const sectionIcons: Record<string, LucideIcon> = {
  topbar: PanelTop,
  nav: Menu,
  hero: Sparkles,
  stats: BarChart3,
  programs: Layers,
  projects: FolderKanban,
  howWeWork: Workflow,
  whyUs: Shield,
  media: Images,
  news: Newspaper,
  partners: Handshake,
  testimonials: MessageSquare,
  licenses: FileBadge,
  sections: Type,
  mapPoints: MapPin,
  newsletter: Mail,
  footer: PanelBottom,
};

const dashboardLink = {
  label: "لوحة التحكم",
  href: "/admin",
  icon: LayoutDashboard,
};

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
  className?: string;
};

export function AdminSidebar({ mobileOpen, onClose, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const DashIcon = dashboardLink.icon;

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-s border-border-subtle bg-surface lg:border-e lg:border-s-0",
        className
      )}
      aria-hidden={mobileOpen === false ? undefined : !mobileOpen}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-4 py-5 sm:px-5">
        <Link href="/admin" className="block min-w-0" onClick={onClose}>
          <p className="text-xs font-medium text-muted-foreground">مؤسسة D.I.F</p>
          <p className="truncate text-lg font-bold text-brand-green-dark dark:text-brand-green">
            لوحة الإدارة
          </p>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-border-subtle lg:hidden"
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="admin-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <ul className="space-y-1">
          <li>
            <Link
              href={dashboardLink.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(dashboardLink.href)
                  ? "bg-brand-green/10 text-brand-green-dark dark:text-brand-green"
                  : "text-foreground/80 hover:bg-brand-green/5 hover:text-brand-green-dark dark:hover:text-brand-green"
              )}
            >
              <DashIcon className="h-4 w-4 shrink-0" />
              {dashboardLink.label}
            </Link>
          </li>
        </ul>

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          أقسام الموقع
        </p>
        <ul className="space-y-0.5 pb-4">
          {HOME_SECTIONS.map((section) => {
            const Icon = sectionIcons[section.id] || LayoutDashboard;
            return (
              <li key={section.id}>
                <Link
                  href={section.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(section.href)
                      ? "bg-brand-green/10 text-brand-green-dark dark:text-brand-green"
                      : "text-foreground/80 hover:bg-brand-green/5 hover:text-brand-green-dark dark:hover:text-brand-green"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" />
                  <span className="truncate">{section.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
