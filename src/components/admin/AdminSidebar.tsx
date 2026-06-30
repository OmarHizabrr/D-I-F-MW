"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
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
  FileText,
  MapPin,
  Mail,
  PanelBottom,
  Type,
  X,
  Heart,
  Inbox,
  Trophy,
  CalendarDays,
  HelpCircle,
  Download,
  HandHeart,
  Briefcase,
  Megaphone,
  Calculator,
  Settings,
  Bell,
  type LucideIcon,
} from "lucide-react";
import {
  HOME_SECTIONS,
  MANAGEMENT_SECTIONS,
  ADMIN_INBOX_LINKS,
} from "@/lib/firebase/database-structure";
import { cn } from "@/lib/utils";

const sectionIcons: Record<string, LucideIcon> = {
  topbar: PanelTop,
  nav: Menu,
  hero: Sparkles,
  stats: BarChart3,
  programs: Layers,
  projects: FolderKanban,
  successStories: Trophy,
  howWeWork: Workflow,
  whyUs: Shield,
  media: Images,
  news: Newspaper,
  events: CalendarDays,
  partners: Handshake,
  testimonials: MessageSquare,
  licenses: FileBadge,
  downloads: Download,
  faq: HelpCircle,
  volunteerOpportunities: HandHeart,
  volunteerApplications: Briefcase,
  sections: Type,
  mapPoints: MapPin,
  newsletter: Mail,
  donation: Heart,
  campaignBanner: Megaphone,
  zakatSettings: Calculator,
  privacy: FileText,
  team: Users,
  contactMessages: Inbox,
  footer: PanelBottom,
};

const managementIcons: Record<string, LucideIcon> = {
  mgmtDashboard: LayoutDashboard,
  mgmtProjects: FolderKanban,
  mgmtGroups: Users,
  mgmtDonors: Heart,
  mgmtNotifications: Bell,
  mgmtSettings: Settings,
};

const inboxIcons: Record<string, LucideIcon> = {
  donation: Heart,
  contactMessages: Inbox,
  volunteerApplications: HandHeart,
  newsletter: Mail,
};

const dashboardLink = {
  label: "الرئيسية",
  href: "/admin",
  icon: LayoutDashboard,
};

type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
  onLinkClick?: () => void;
  className?: string;
};

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-brand-green/10 text-brand-green-dark dark:text-brand-green"
          : "text-foreground/80 hover:bg-brand-green/5 hover:text-brand-green-dark dark:hover:text-brand-green"
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AdminSidebar({ open, onClose, onLinkClick, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const DashIcon = dashboardLink.icon;

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    const base = href.split("?")[0];
    return pathname === base || pathname.startsWith(`${base}/`);
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-s border-border-subtle bg-surface lg:border-e lg:border-s-0",
        className
      )}
      aria-hidden={open === false ? true : undefined}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-4 py-5 sm:px-5">
        <Link href="/admin" className="block min-w-0" onClick={onLinkClick}>
          <p className="text-xs font-medium text-muted-foreground">مؤسسة D.I.F</p>
          <p className="truncate text-lg font-bold text-brand-green-dark dark:text-brand-green">
            لوحة الإدارة
          </p>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-border-subtle"
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="admin-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              href={dashboardLink.href}
              label={dashboardLink.label}
              icon={DashIcon}
              active={isActive(dashboardLink.href)}
              onClick={onLinkClick}
            />
          </li>
        </ul>

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          المشاريع والمتبرعون
        </p>
        <ul className="space-y-0.5">
          {MANAGEMENT_SECTIONS.map((section) => {
            const Icon = managementIcons[section.id] || FolderKanban;
            return (
              <li key={section.id}>
                <NavLink
                  href={section.href}
                  label={section.label}
                  icon={Icon}
                  active={isActive(section.href)}
                  onClick={onLinkClick}
                />
              </li>
            );
          })}
        </ul>

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          صندوق الوارد
        </p>
        <ul className="space-y-0.5">
          {ADMIN_INBOX_LINKS.map((link) => {
            const Icon = inboxIcons[link.id] || Inbox;
            return (
              <li key={link.id}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  icon={Icon}
                  active={isActive(link.href)}
                  onClick={onLinkClick}
                />
              </li>
            );
          })}
        </ul>

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          النظام
        </p>
        <ul className="space-y-0.5">
          <li>
            <NavLink
              href="/admin/users"
              label="المستخدمون"
              icon={Users}
              active={isActive("/admin/users")}
              onClick={onLinkClick}
            />
          </li>
        </ul>

        <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          محتوى الموقع
        </p>
        <ul className="space-y-0.5 pb-4">
          {HOME_SECTIONS.map((section) => {
            const Icon = sectionIcons[section.id] || LayoutDashboard;
            return (
              <li key={section.id}>
                <NavLink
                  href={section.href}
                  label={section.label}
                  icon={Icon}
                  active={isActive(section.href)}
                  onClick={onLinkClick}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
