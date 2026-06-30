"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban, Users, Heart, Bell, ArrowLeft, Settings } from "lucide-react";
import { listOrgProjects } from "@/services/projectManagementService";
import { listGroups } from "@/services/groupService";
import { listDonors } from "@/services/donorService";
import { listAllNotifications } from "@/services/notificationService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFlowGuide } from "@/components/admin/AdminFlowGuide";
import { AdminPreviewLink } from "@/components/admin/AdminPreviewLink";
import { Spinner } from "@/components/ui/Spinner";
import { MANAGEMENT_SECTIONS } from "@/lib/firebase/database-structure";

export default function ManagementDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ projects: 0, groups: 0, donors: 0, notifications: 0 });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [projects, groups, donors, notifications] = await Promise.all([
          listOrgProjects(),
          listGroups(),
          listDonors(),
          listAllNotifications(),
        ]);
        if (cancelled) return;
        setStats({
          projects: projects.length,
          groups: groups.length,
          donors: donors.length,
          notifications: notifications.filter((n) => !n.read).length,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const cards = [
    { label: "المشاريع", value: stats.projects, icon: FolderKanban, href: "/admin/management/projects" },
    { label: "المتبرعون", value: stats.donors, icon: Heart, href: "/admin/management/donors" },
    { label: "إشعارات جديدة", value: stats.notifications, icon: Bell, href: "/admin/management/notifications" },
    { label: "فرق العمل", value: stats.groups, icon: Users, href: "/admin/management/groups" },
  ];

  const quickLinks = MANAGEMENT_SECTIONS.filter((s) => s.id !== "mgmtDashboard");

  return (
    <div>
      <AdminPageHeader
        title="المشاريع والمتبرعون"
        description="إدارة المشاريع التشغيلية وبوابة متابعة المتبرعين"
        actions={
          <AdminPreviewLink href="/portal" label="بوابة المتبرعين" size="sm" />
        }
      />

      <AdminFlowGuide
        title="الترتيب الموصى به"
        steps={[
          "١. أضف المتبرع من قسم «المتبرعون» وفعّل البوابة",
          "٢. أنشئ مشروعاً واربطه بالمتبرع الرئيسي",
          "٣. أرسل للمتبرع رابط البوابة أو QR أو اسم المستخدم والرمز",
          "٤. أضف فريق العمل من تبويب «الأعضاء» داخل المشروع",
          "٥. انشر المشروع على الموقع عند الجاهزية",
        ]}
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

      <h2 className="mb-4 text-lg font-semibold">الأقسام</h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {quickLinks.map((section) => {
          const publicHref = "publicHref" in section ? section.publicHref : undefined;
          return (
            <div
              key={section.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-3"
            >
              <Link
                href={section.href}
                className="flex flex-1 items-center gap-3 text-sm font-medium transition-colors hover:text-brand-green"
              >
                <ArrowLeft className="h-4 w-4 text-brand-green" />
                {section.label}
              </Link>
              {publicHref && (
                <AdminPreviewLink href={publicHref} size="sm" label="معاينة" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-3">
        <Settings className="h-4 w-4 text-brand-green" />
        <Link
          href="/admin/management/settings"
          className="text-sm font-medium hover:text-brand-green"
        >
          إعدادات البوابة — تفعيل/إيقاف دخول المتبرعين
        </Link>
      </div>
    </div>
  );
}
