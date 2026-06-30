"use client";

import { useEffect, useState } from "react";
import { listGroups } from "@/services/groupService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminItemList } from "@/components/admin/AdminItemList";
import { Spinner } from "@/components/ui/Spinner";
import type { ProjectGroup } from "@/types/project-management";

export default function ManagementGroupsPage() {
  const [items, setItems] = useState<ProjectGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const groups = await listGroups();
      if (cancelled) return;
      setItems(groups);
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

  return (
    <div>
      <AdminPageHeader
        title="المجموعات"
        description="فِرق العمل لكل مشروع — تُنشأ تلقائياً. أضف الأعضاء من تبويب «الأعضاء» داخل المشروع"
      />
      <AdminItemList
        items={items}
        emptyMessage="لا توجد مجموعات بعد — تُنشأ تلقائياً مع كل مشروع جديد"
        onEdit={() => {}}
        onDelete={() => {}}
        renderTitle={(item) => item.groupName}
        renderSubtitle={(item) =>
          `المشروع: ${item.projectId} · ${item.membersCount} عضو · ${item.status}`
        }
      />
    </div>
  );
}
