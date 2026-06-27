"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  Layers,
  Newspaper,
  ImageIcon,
  Handshake,
  MessageSquare,
  Activity,
} from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { COLLECTIONS, SITE_ROOT } from "@/lib/firebase/database-structure";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSeedPanel } from "@/components/admin/AdminSeedPanel";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { DashboardStats } from "@/types/cms";

const api = FirestoreApi.Api;

const statCards: {
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
  { key: "activeProjects", label: "مشاريع جارية", icon: Activity },
  { key: "completedProjects", label: "مشاريع مكتملة", icon: FolderKanban },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, programs, news, media, partners, testimonials] = await Promise.all([
          api.getSubCollectionCount(COLLECTIONS.projects, SITE_ROOT, COLLECTIONS.projects),
          api.getSubCollectionCount(COLLECTIONS.programs, SITE_ROOT, COLLECTIONS.programs),
          api.getSubCollectionCount(COLLECTIONS.news, SITE_ROOT, COLLECTIONS.news),
          api.getSubCollectionCount(COLLECTIONS.media, SITE_ROOT, COLLECTIONS.media),
          api.getSubCollectionCount(COLLECTIONS.partners, SITE_ROOT, COLLECTIONS.partners),
          api.getSubCollectionCount(COLLECTIONS.testimonials, SITE_ROOT, COLLECTIONS.testimonials),
        ]);

        const projectDocs = await api.getOrderedDocuments(api.getProjectsCollection());
        let activeProjects = 0;
        let completedProjects = 0;
        let delayedProjects = 0;

        for (const doc of projectDocs) {
          const status = doc.data().status as string;
          if (status === "ongoing") activeProjects++;
          else if (status === "completed") completedProjects++;
          else if (status === "delayed") delayedProjects++;
        }

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
        description="إدارة محتوى الموقع — تهيئة، تعديل، إضافة، وحذف"
      />

      <AdminSeedPanel />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {statCards.map(({ key, label, icon: Icon }) => (
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
      )}
    </div>
  );
}
