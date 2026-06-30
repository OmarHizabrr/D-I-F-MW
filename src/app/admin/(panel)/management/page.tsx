"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban, Users, Heart, Bell, ArrowLeft } from "lucide-react";
import { listOrgProjects } from "@/services/projectManagementService";
import { listGroups } from "@/services/groupService";
import { listDonors } from "@/services/donorService";
import { listAllNotifications } from "@/services/notificationService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { MANAGEMENT_SECTIONS } from "@/lib/firebase/database-structure";

export default function ManagementDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ projects: 0, groups: 0, donors: 0, notifications: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [projects, groups, donors, notifications] = await Promise.all([
          listOrgProjects(),
          listGroups(),
          listDonors(),
          listAllNotifications(),
        ]);
        setStats({
          projects: projects.length,
          groups: groups.length,
          donors: donors.length,
          notifications: notifications.filter((n) => !n.read).length,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const cards = [
    { label: "المشاريع التشغيلية", value: stats.projects, icon: FolderKanban, href: "/admin/management/projects" },
    { label: "المجموعات", value: stats.groups, icon: Users, href: "/admin/management/groups" },
    { label: "المتبرعون", value: stats.donors, icon: Heart, href: "/admin/management/donors" },
    { label: "إشعارات غير مقروءة", value: stats.notifications, icon: Bell, href: "/admin/management/notifications" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="إدارة المشاريع والمتبرعين"
        description="لوحة التحكم المركزية لنظام إدارة المشاريع الخيرية"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-border-subtle bg-surface p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <Icon className="h-8 w-8 text-brand-green" />
                <span className="text-2xl font-bold text-brand-green-dark dark:text-brand-green">
                  {card.value}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground/80">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <h2 className="mb-4 text-lg font-semibold">أقسام النظام</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MANAGEMENT_SECTIONS.filter((s) => s.id !== "mgmtDashboard").map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm font-medium transition-colors hover:bg-brand-green/5"
          >
            <ArrowLeft className="h-4 w-4 text-brand-green" />
            {section.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
