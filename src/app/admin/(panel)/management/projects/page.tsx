"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { listOrgProjects, deleteOrgProject } from "@/services/projectManagementService";
import { createProjectWithGroup } from "@/services/projectOrchestrationService";
import { listDonors } from "@/services/donorService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { AdminFlowGuide } from "@/components/admin/AdminFlowGuide";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FORM_PLACEHOLDERS, FORM_HINTS } from "@/lib/admin/form-placeholders";
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
    additionalDonorIds: [],
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

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [projects, donorList] = await Promise.all([listOrgProjects(), listDonors()]);
      if (cancelled) return;
      setItems(projects);
      setDonors(donorList);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (!editing || !user) return;
    setSaving(true);
    try {
      await createProjectWithGroup(editing, user.uid, {
        uid: user.uid,
        displayName: user.email ?? undefined,
      });
      setEditing(null);
      const [projects, donorList] = await Promise.all([listOrgProjects(), listDonors()]);
      setItems(projects);
      setDonors(donorList);
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
      setItems(await listOrgProjects());
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

      <AdminFlowGuide
        title="أين يتابع المتبرع مشاريعه؟"
        steps={[
          "إنشاء متبرع من «إدارة المتبرعون» مع بريده الإلكتروني الصحيح",
          "ربط متبرع رئيسي بالمشروع هنا أو من تفاصيل المشروع",
          "المتبرع يدخل /portal عبر Google — يُربط تلقائياً ويرى مشاريعه",
          "فريق العمل والمشرفون يُضافون من تبويب «الأعضاء» داخل المشروع",
          "الزوار يرون المشروع المنشور على /projects عند تفعيل «نشر على الموقع»",
        ]}
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
              placeholder={FORM_PLACEHOLDERS.project.number}
              dir="ltr"
              value={editing.projectNumber}
              onChange={(e) => setEditing({ ...editing, projectNumber: e.target.value })}
            />
            <Input
              label="اسم المشروع"
              placeholder={FORM_PLACEHOLDERS.project.name}
              value={editing.projectName}
              onChange={(e) => setEditing({ ...editing, projectName: e.target.value })}
            />
            <Input
              label="نوع المشروع"
              placeholder={FORM_PLACEHOLDERS.project.type}
              value={editing.projectType}
              onChange={(e) => setEditing({ ...editing, projectType: e.target.value })}
            />
            <Select
              label="المتبرع الرئيسي"
              value={editing.donorId}
              onChange={(donorId) => setEditing({ ...editing, donorId })}
              placeholder="اختر المتبرع الداعم الرئيسي"
              options={[
                { value: "", label: "— بدون متبرع —" },
                ...donors.map((d) => ({ value: d.id, label: d.fullName })),
              ]}
            />
            <p className="text-xs text-muted-foreground">{FORM_HINTS.project.donorPrimary}</p>
            <Input
              label="الدولة"
              placeholder={FORM_PLACEHOLDERS.project.country}
              value={editing.country}
              onChange={(e) => setEditing({ ...editing, country: e.target.value })}
            />
            <Input
              label="المدينة"
              placeholder={FORM_PLACEHOLDERS.project.city}
              value={editing.city}
              onChange={(e) => setEditing({ ...editing, city: e.target.value })}
            />
            <Input
              label="العنوان"
              placeholder={FORM_PLACEHOLDERS.project.address}
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
              placeholder={FORM_PLACEHOLDERS.project.description}
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
