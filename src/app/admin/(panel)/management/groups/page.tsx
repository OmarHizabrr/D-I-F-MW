"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listGroups } from "@/services/groupService";
import { listOrgProjects } from "@/services/projectManagementService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminItemList } from "@/components/admin/AdminItemList";
import { Spinner } from "@/components/ui/Spinner";
import type { OrgProject, ProjectGroup } from "@/types/project-management";

export default function ManagementGroupsPage() {
  const router = useRouter();
  const [items, setItems] = useState<ProjectGroup[]>([]);
  const [projects, setProjects] = useState<OrgProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [groups, orgProjects] = await Promise.all([listGroups(), listOrgProjects()]);
      if (cancelled) return;
      setItems(groups);
      setProjects(orgProjects);
      setLoading(false);
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

  function projectLabel(projectId: string) {
    const p = projects.find((x) => x.id === projectId);
    return p ? `${p.projectName} (${p.projectNumber})` : projectId;
  }

  return (
    <div>
      <AdminPageHeader
        title="فرق العمل"
        description="تُنشأ تلقائياً مع كل مشروع — أضف الأعضاء من تبويب «الأعضاء» داخل المشروع"
      />
      <AdminItemList
        items={items}
        emptyMessage="لا توجد فرق بعد — تُنشأ تلقائياً مع كل مشروع جديد"
        onEdit={(item) => router.push(`/admin/management/projects/${item.projectId}`)}
        renderTitle={(item) => item.groupName}
        renderSubtitle={(item) => (
          <span className="flex flex-wrap gap-2">
            <span>{projectLabel(item.projectId)}</span>
            <span>· {item.membersCount} عضو</span>
          </span>
        )}
        getPreviewHref={(item) => {
          const p = projects.find((x) => x.id === item.projectId);
          return p?.publishedOnSite ? `/projects/${item.projectId}` : null;
        }}
      />
      <p className="mt-4 text-xs text-muted-foreground">
        اضغط على الفريق للانتقال إلى إدارة المشروع وإضافة الأعضاء.
      </p>
    </div>
  );
}
