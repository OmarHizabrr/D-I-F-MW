"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listOrgProjects, deleteOrgProject } from "@/services/projectManagementService";
import { createProjectWithGroup } from "@/services/projectOrchestrationService";
import { listDonors } from "@/services/donorService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminItemList } from "@/components/admin/AdminItemList";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { RangeSlider } from "@/components/ui/RangeSlider";
import type { OrgProject, Donor, ProjectStatus } from "@/types/project-management";
import { PROJECT_STATUS_LABELS } from "@/types/project-management";

const statusOptions = Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

function newProject(): Omit<OrgProject, "id" | "createdAt" | "updatedAt" | "createdBy" | "groupId"> {
  return {
    projectNumber: "",
    projectName: "",
    projectType: "بئر ماء",
    description: "",
    donorId: "",
    country: "مالاوي",
    city: "",
    address: "",
    status: "draft",
    progress: 0,
    startDate: new Date().toISOString().slice(0, 10),
    expectedEndDate: "",
    isArchived: false,
    publishedOnSite: false,
    featuredOnHome: false,
    showDonorPublic: false,
    order: 0,
  };
}

export default function ManagementProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<OrgProject[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ReturnType<typeof newProject> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OrgProject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const [projects, donorList] = await Promise.all([listOrgProjects(), listDonors()]);
    setItems(projects);
    setDonors(donorList);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  async function handleSave() {
    if (!editing || !user) return;
    setSaving(true);
    try {
      await createProjectWithGroup(editing, user.uid, {
        uid: user.uid,
        displayName: user.email ?? undefined,
      });
      setEditing(null);
      await loadItems();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteOrgProject(deleteTarget.id);
      setDeleteTarget(null);
      await loadItems();
    } finally {
      setDeletingId(null);
    }
  }

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
        title="المشاريع التشغيلية"
        description="إدارة المشاريع الخيرية مع الفرق والمتبرعين والتقارير"
        actions={
          <Button onClick={() => setEditing(newProject())}>
            <Plus className="h-4 w-4" />
            مشروع جديد
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title="مشروع تشغيلي جديد"
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
            <Input
              label="رقم المشروع"
              value={editing.projectNumber}
              onChange={(e) => setEditing({ ...editing, projectNumber: e.target.value })}
            />
            <Input
              label="اسم المشروع"
              value={editing.projectName}
              onChange={(e) => setEditing({ ...editing, projectName: e.target.value })}
            />
            <Input
              label="نوع المشروع"
              value={editing.projectType}
              onChange={(e) => setEditing({ ...editing, projectType: e.target.value })}
            />
            <Select
              label="المتبرع"
              value={editing.donorId}
              onChange={(donorId) => setEditing({ ...editing, donorId })}
              options={[
                { value: "", label: "— بدون متبرع —" },
                ...donors.map((d) => ({ value: d.id, label: d.fullName })),
              ]}
            />
            <Input
              label="الدولة"
              value={editing.country}
              onChange={(e) => setEditing({ ...editing, country: e.target.value })}
            />
            <Input
              label="المدينة"
              value={editing.city}
              onChange={(e) => setEditing({ ...editing, city: e.target.value })}
            />
            <Input
              label="العنوان"
              value={editing.address}
              onChange={(e) => setEditing({ ...editing, address: e.target.value })}
            />
            <Select
              label="الحالة"
              value={editing.status}
              onChange={(status) =>
                setEditing({ ...editing, status: status as ProjectStatus })
              }
              options={statusOptions}
            />
            <RangeSlider
              label="نسبة الإنجاز"
              value={editing.progress}
              onChange={(progress) => setEditing({ ...editing, progress })}
            />
            <Input
              label="تاريخ البداية"
              type="date"
              dir="ltr"
              value={editing.startDate}
              onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
            />
            <Input
              label="تاريخ الانتهاء المتوقع"
              type="date"
              dir="ltr"
              value={editing.expectedEndDate}
              onChange={(e) => setEditing({ ...editing, expectedEndDate: e.target.value })}
            />
            <Input
              label="الوصف"
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={!!deletingId}
        message={`هل أنت متأكد من حذف مشروع «${deleteTarget?.projectName}»؟`}
      />

      <AdminItemList
        items={items}
        emptyMessage="لا توجد مشاريع تشغيلية بعد"
        deletingId={deletingId}
        onEdit={(item) => router.push(`/admin/management/projects/${item.id}`)}
        onDelete={setDeleteTarget}
        renderTitle={(item) => item.projectName}
        renderSubtitle={(item) =>
          `${item.projectNumber} · ${PROJECT_STATUS_LABELS[item.status]} · ${item.progress}%${item.publishedOnSite ? " · منشور" : ""}`
        }
        getPreviewHref={(item) =>
          item.publishedOnSite ? `/projects/${item.id}` : null
        }
      />
    </div>
  );
}
