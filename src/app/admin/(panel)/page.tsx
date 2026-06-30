"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Layers,
  Newspaper,
  ImageIcon,
  Handshake,
  MessageSquare,
  Activity,
  Heart,
  Inbox,
  Mail,
  Users,
  ArrowLeft,
  Trophy,
  CalendarDays,
  HelpCircle,
  Download,
  HandHeart,
} from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { COLLECTIONS, SITE_ROOT } from "@/lib/firebase/database-structure";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPreviewLink } from "@/components/admin/AdminPreviewLink";
import { AdminSeedPanel } from "@/components/admin/AdminSeedPanel";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { DashboardStats } from "@/types/cms";

const api = FirestoreApi.Api;

const contentStatCards: {
  key: keyof DashboardStats;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "projects", label: "المشاريع", icon: FolderKanban },
  { key: "programs", label: "البرامج", icon: Layers },
  { key: "news", label: "الأخبار", icon: Newspaper },
  { key: "media", label: "الوسائط", icon: ImageIcon },
  { key: "partners", label: "الشركاء", icon: Handshake },
  { key: "testimonials", label: "آراء المستفيدين", icon: MessageSquare },
  { key: "successStories", label: "قصص النجاح", icon: Trophy },
  { key: "events", label: "الفعاليات", icon: CalendarDays },
  { key: "faqItems", label: "الأسئلة الشائعة", icon: HelpCircle },
  { key: "downloads", label: "الموارد", icon: Download },
  { key: "volunteerOpportunities", label: "فرص التطوع", icon: HandHeart },
  { key: "activeProjects", label: "مشاريع جارية", icon: Activity },
  { key: "completedProjects", label: "مشاريع مكتملة", icon: FolderKanban },
];

const inboxLinks = [
  {
    href: "/admin/donation",
    label: "طلبات التبرع",
    key: "donationIntents" as const,
    icon: Heart,
    tab: "intents",
  },
  {
    href: "/admin/contact-messages",
    label: "رسائل التواصل",
    key: "totalContactMessages" as const,
    unreadKey: "unreadContactMessages" as const,
    icon: Inbox,
  },
  {
    href: "/admin/newsletter",
    label: "مشتركو النشرة",
    key: "newsletterSubscribers" as const,
    icon: Mail,
    tab: "subscribers",
  },
  {
    href: "/admin/team",
    label: "أعضاء الفريق",
    key: "teamMembers" as const,
    icon: Users,
  },
  {
    href: "/admin/volunteer-applications",
    label: "طلبات التطوع",
    key: "volunteerApplications" as const,
    unreadKey: "unreadVolunteerApplications" as const,
    icon: HandHeart,
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          projects,
          programs,
          news,
          media,
          partners,
          testimonials,
          donationIntents,
          newsletterSubscribers,
          teamMembers,
          successStories,
          events,
          faqItems,
          downloads,
          volunteerOpportunities,
        ] = await Promise.all([
          api.getSubCollectionCount(COLLECTIONS.projects, SITE_ROOT, COLLECTIONS.projects),
          api.getSubCollectionCount(COLLECTIONS.programs, SITE_ROOT, COLLECTIONS.programs),
          api.getSubCollectionCount(COLLECTIONS.news, SITE_ROOT, COLLECTIONS.news),
          api.getSubCollectionCount(COLLECTIONS.media, SITE_ROOT, COLLECTIONS.media),
          api.getSubCollectionCount(COLLECTIONS.partners, SITE_ROOT, COLLECTIONS.partners),
          api.getSubCollectionCount(COLLECTIONS.testimonials, SITE_ROOT, COLLECTIONS.testimonials),
          api.getSubCollectionCount(COLLECTIONS.donationIntents, SITE_ROOT, COLLECTIONS.donationIntents),
          api.getSubCollectionCount(
            COLLECTIONS.newsletterSubscribers,
            SITE_ROOT,
            COLLECTIONS.newsletterSubscribers
          ),
          api.getSubCollectionCount(COLLECTIONS.team, SITE_ROOT, COLLECTIONS.team),
          api.getSubCollectionCount(COLLECTIONS.successStories, SITE_ROOT, COLLECTIONS.successStories),
          api.getSubCollectionCount(COLLECTIONS.events, SITE_ROOT, COLLECTIONS.events),
          api.getSubCollectionCount(COLLECTIONS.faq, SITE_ROOT, COLLECTIONS.faq),
          api.getSubCollectionCount(COLLECTIONS.downloads, SITE_ROOT, COLLECTIONS.downloads),
          api.getSubCollectionCount(
            COLLECTIONS.volunteerOpportunities,
            SITE_ROOT,
            COLLECTIONS.volunteerOpportunities
          ),
        ]);

        const [projectDocs, contactDocs, volunteerDocs] = await Promise.all([
          api.getOrderedDocuments(api.getProjectsCollection()),
          api.getOrderedDocuments(api.getContactMessagesCollection()),
          api.getOrderedDocuments(api.getVolunteerApplicationsCollection()),
        ]);

        let activeProjects = 0;
        let completedProjects = 0;
        let delayedProjects = 0;

        for (const doc of projectDocs) {
          const status = doc.data().status as string;
          if (status === "ongoing") activeProjects++;
          else if (status === "completed") completedProjects++;
          else if (status === "delayed") delayedProjects++;
        }

        const unreadContactMessages = contactDocs.filter((d) => !d.data().read).length;
        const totalContactMessages = contactDocs.length;
        const unreadVolunteerApplications = volunteerDocs.filter((d) => !d.data().read).length;
        const volunteerApplications = volunteerDocs.length;

        setStats({
          projects,
          programs,
          news,
          media,
          partners,
          testimonials,
          activeProjects,
          completedProjects,
          delayedProjects,
          donationIntents,
          totalContactMessages,
          unreadContactMessages,
          newsletterSubscribers,
          teamMembers,
          successStories,
          events,
          faqItems,
          downloads,
          volunteerOpportunities,
          volunteerApplications,
          unreadVolunteerApplications,
        });
      } finally {
        setLoading(false);
      }
    }

    void loadStats();
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="لوحة التحكم"
        description="إدارة الموقع والمشاريع والطلبات الواردة"
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminPreviewLink href="/projects" label="المشاريع" size="sm" />
            <AdminPreviewLink href="/portal" label="بوابة المتبرعين" size="sm" />
          </div>
        }
      />

      <p className="mb-3 text-sm font-semibold text-muted-foreground">المشاريع والمتبرعون</p>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/management">
          <Card
            hover={false}
            padding="md"
            className="h-full transition-colors hover:border-brand-green/30 hover:bg-brand-green/5"
          >
            <CardContent className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                <FolderKanban className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">نظرة عامة</CardTitle>
                <p className="text-xs text-muted-foreground">المشاريع التشغيلية والمتبرعون</p>
              </div>
              <ArrowLeft className="ms-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/management/projects">
          <Card
            hover={false}
            padding="md"
            className="h-full transition-colors hover:border-brand-green/30 hover:bg-brand-green/5"
          >
            <CardContent className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">المشاريع</CardTitle>
                <p className="text-xs text-muted-foreground">إنشاء ومتابعة المشاريع</p>
              </div>
              <ArrowLeft className="ms-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/management/donors">
          <Card
            hover={false}
            padding="md"
            className="h-full transition-colors hover:border-brand-green/30 hover:bg-brand-green/5"
          >
            <CardContent className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">المتبرعون</CardTitle>
                <p className="text-xs text-muted-foreground">البوابة والروابط</p>
              </div>
              <ArrowLeft className="ms-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/management/settings">
          <Card
            hover={false}
            padding="md"
            className="h-full transition-colors hover:border-brand-green/30 hover:bg-brand-green/5"
          >
            <CardContent className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-brown/10 text-brand-brown">
                <HandHeart className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">إعدادات البوابة</CardTitle>
                <p className="text-xs text-muted-foreground">تفعيل دخول المتبرعين</p>
              </div>
              <ArrowLeft className="ms-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <AdminSeedPanel />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm font-semibold text-muted-foreground">صندوق الوارد</p>
          <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {inboxLinks.map(({ href, label, key, icon: Icon, tab, unreadKey }) => {
              const count = stats?.[key] ?? 0;
              const unread = unreadKey ? stats?.[unreadKey] ?? 0 : 0;
              const linkHref = tab ? `${href}?tab=${tab}` : href;

              return (
                <Link key={href} href={linkHref}>
                  <Card
                    hover={false}
                    padding="md"
                    className="transition-colors hover:border-brand-green/30 hover:bg-brand-green/5"
                  >
                    <CardContent className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-brown/10 text-brand-brown">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">{label}</CardTitle>
                          <p className="text-xl font-bold">{count}</p>
                        </div>
                      </div>
                      {unread > 0 && (
                        <span className="rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold text-white">
                          {unread} جديد
                        </span>
                      )}
                      <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <p className="mb-3 text-sm font-semibold text-muted-foreground">محتوى الموقع</p>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {contentStatCards.map(({ key, label, icon: Icon }) => (
              <Card key={key} hover={false} padding="md">
                <CardContent className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green-dark dark:text-brand-green sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                      {label}
                    </CardTitle>
                    <p className="text-xl font-bold text-foreground sm:text-2xl">
                      {stats?.[key] ?? 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
