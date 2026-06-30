"use client";

import { Plus } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminItemList } from "@/components/admin/AdminItemList";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { YouTubeField } from "@/components/admin/YouTubeField";
import { pickAdminLabel } from "@/lib/admin/pickAdminLabel";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { ProjectItem, ProjectStatus } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "ongoing", label: "جاري" },
  { value: "completed", label: "مكتمل" },
  { value: "delayed", label: "متأخر" },
  { value: "needs_update", label: "يحتاج تحديث" },
];

function newProject(order: number): ProjectItem {
  return {
    id: "",
    code: "",
    name: emptyLocalized(),
    country: emptyLocalized(),
    city: "",
    programId: "",
    progress: 0,
    status: "ongoing",
    imageUrl: "",
    lastUpdate: new Date().toISOString().slice(0, 10),
    donorName: "",
    showDonor: false,
    description: emptyLocalized(),
    youtubeUrl: "",
    enabled: true,
    order,
  };
}

export default function AdminProjectsPage() {
  const { user } = useAuth();
  const {
    items,
    loading,
    editing,
    setEditing,
    saving,
    deletingId,
    deleteTarget,
    setDeleteTarget,
    handleSave,
    handleDeleteConfirm,
  } = useAdminCrud<ProjectItem>({
    getCollection: () => api.getProjectsCollection(),
    getDocRef: (id) => api.getProjectDoc(id),
    newIdPrefix: "projects",
    user: user ? { uid: user.uid, displayName: user.email ?? undefined } : null,
  });

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
        title="المشاريع"
        description="إدارة قائمة المشاريع التنموية"
        actions={
          <Button onClick={() => setEditing(newProject(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة مشروع
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل مشروع" : "مشروع جديد"}
        onSave={handleSave}
        saving={saving}
        size="full"
      >
        {editing && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="رمز المشروع"
                dir="ltr"
                value={editing.code}
                onChange={(e) => setEditing({ ...editing, code: e.target.value })}
              />
              <Input
                label="المدينة"
                value={editing.city}
                onChange={(e) => setEditing({ ...editing, city: e.target.value })}
              />
            </div>

            <LocalizedInput
              label="اسم المشروع"
              value={editing.name}
              onChange={(name) => setEditing({ ...editing, name })}
            />

            <LocalizedInput
              label="الدولة"
              value={editing.country}
              onChange={(country) => setEditing({ ...editing, country })}
            />

            <LocalizedInput
              label="وصف المشروع (صفحة التفاصيل)"
              value={editing.description ?? emptyLocalized()}
              onChange={(description) => setEditing({ ...editing, description })}
              multiline
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="معرّف البرنامج"
                dir="ltr"
                value={editing.programId}
                onChange={(e) => setEditing({ ...editing, programId: e.target.value })}
              />
              <Select
                label="الحالة"
                value={editing.status}
                onChange={(status) => setEditing({ ...editing, status: status as ProjectStatus })}
                options={statusOptions}
              />
            </div>

            <RangeSlider
              label="نسبة الإنجاز"
              value={editing.progress}
              onChange={(progress) => setEditing({ ...editing, progress })}
              hint="اسحب الشريط لتعديل نسبة الإنجاز"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="اسم المتبرع"
                value={editing.donorName}
                onChange={(e) => setEditing({ ...editing, donorName: e.target.value })}
              />
              <Input
                label="آخر تحديث"
                type="date"
                dir="ltr"
                value={editing.lastUpdate}
                onChange={(e) => setEditing({ ...editing, lastUpdate: e.target.value })}
              />
            </div>

            <Input
              label="الترتيب"
              type="number"
              value={editing.order}
              onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
            />

            <FileUploadField
              label="صورة المشروع"
              folder="projects"
              value={editing.imageUrl}
              onChange={(imageUrl) => setEditing({ ...editing, imageUrl })}
            />

            <YouTubeField
              value={editing.youtubeUrl ?? ""}
              onChange={(youtubeUrl) => setEditing({ ...editing, youtubeUrl })}
              label="فيديو المشروع (اختياري)"
            />

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.showDonor}
                  onChange={(e) => setEditing({ ...editing, showDonor: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-brand-green focus:ring-brand-green"
                />
                إظهار المتبرع
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(editing.featured)}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-brand-green focus:ring-brand-green"
                />
                مميز في «أعمالنا»
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.enabled}
                  onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-brand-green focus:ring-brand-green"
                />
                مفعّل
              </label>
            </div>
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={!!deletingId}
        message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.name)}»؟ لا يمكن التراجع.`}
      />

      <AdminItemList
        items={items}
        emptyMessage="لا توجد مشاريع بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => (
          <>
            {pickAdminLabel(item.name)}
            {item.code && (
              <span className="ms-2 text-xs font-normal text-muted-foreground">({item.code})</span>
            )}
          </>
        )}
        renderSubtitle={(item) => (
          <>
            {pickAdminLabel(item.country)} · {item.city} · {item.progress}% ·{" "}
            {statusOptions.find((s) => s.value === item.status)?.label}
            {!item.enabled && " · معطّل"}
          </>
        )}
        getPreviewHref={(item) => (item.enabled ? `/projects/${item.id}` : null)}
      />
    </div>
  );
}
