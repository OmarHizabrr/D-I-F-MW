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
import { IconPicker } from "@/components/admin/IconPicker";
import { pickAdminLabel } from "@/lib/admin/pickAdminLabel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { DownloadItem, DownloadFileType } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

const fileTypes: { value: DownloadFileType; label: string }[] = [
  { value: "report", label: "تقرير" },
  { value: "brochure", label: "كتيب" },
  { value: "form", label: "نموذج" },
  { value: "other", label: "أخرى" },
];

function newItem(order: number): DownloadItem {
  return {
    id: "",
    title: emptyLocalized(),
    description: emptyLocalized(),
    fileUrl: "",
    fileType: "report",
    year: new Date().getFullYear().toString(),
    iconKey: "registration",
    enabled: true,
    order,
  };
}

export default function AdminDownloadsPage() {
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
  } = useAdminCrud<DownloadItem>({
    getCollection: () => api.getDownloadsCollection(),
    getDocRef: (id) => api.getDownloadDoc(id),
    newIdPrefix: "downloads",
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
        title="التقارير والموارد"
        description="إدارة ملفات التحميل والتقارير"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة ملف
          </Button>
        }
      />

      <AdminFormDialog open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "تعديل ملف" : "ملف جديد"} onSave={handleSave} saving={saving}>
        {editing && (
          <>
            <LocalizedInput label="العنوان" value={editing.title} onChange={(title) => setEditing({ ...editing, title })} />
            <LocalizedInput label="الوصف" value={editing.description} onChange={(description) => setEditing({ ...editing, description })} multiline />
            <div className="flex w-full flex-col gap-1.5">
              <label className="text-sm font-medium">نوع الملف</label>
              <select
                value={editing.fileType}
                onChange={(e) => setEditing({ ...editing, fileType: e.target.value as DownloadFileType })}
                className="rounded-2xl border border-border bg-input-bg px-4 py-3 text-sm"
              >
                {fileTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <Input label="السنة" value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
            <IconPicker iconKey={editing.iconKey} iconImageUrl={editing.iconImageUrl || ""} onIconKeyChange={(iconKey) => setEditing({ ...editing, iconKey })} onIconImageChange={(iconImageUrl) => setEditing({ ...editing, iconImageUrl })} uploadFolder="icons/downloads" />
            <FileUploadField label="الملف" folder="downloads" accept="application/pdf,.pdf,image/*" value={editing.fileUrl} onChange={(fileUrl) => setEditing({ ...editing, fileUrl })} />
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} loading={!!deletingId} message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.title)}»؟`} />

      <AdminItemList items={items} emptyMessage="لا توجد ملفات بعد" deletingId={deletingId} onEdit={setEditing} onDelete={setDeleteTarget} renderTitle={(item) => pickAdminLabel(item.title)} renderSubtitle={(item) => `${item.year} · ${item.fileType}`} />
    </div>
  );
}
