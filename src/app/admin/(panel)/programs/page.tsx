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
import { pickAdminLabel } from "@/lib/admin/pickAdminLabel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { ProgramItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newProgram(order: number): ProgramItem {
  return {
    id: "",
    iconKey: "community",
    title: emptyLocalized(),
    description: emptyLocalized(),
    imageUrl: "",
    color: "from-brand-green/30 to-brand-green/10",
    order,
    enabled: true,
  };
}

export default function AdminProgramsPage() {
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
  } = useAdminCrud<ProgramItem>({
    getCollection: () => api.getProgramsCollection(),
    getDocRef: (id) => api.getProgramDoc(id),
    newIdPrefix: "programs",
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
        title="البرامج"
        description="إدارة البرامج الرئيسية للمؤسسة"
        actions={
          <Button onClick={() => setEditing(newProgram(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة برنامج
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل برنامج" : "برنامج جديد"}
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
            <LocalizedInput
              label="العنوان"
              value={editing.title}
              onChange={(title) => setEditing({ ...editing, title })}
            />
            <LocalizedInput
              label="الوصف"
              value={editing.description}
              onChange={(description) => setEditing({ ...editing, description })}
              multiline
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="مفتاح الأيقونة"
                value={editing.iconKey}
                onChange={(e) => setEditing({ ...editing, iconKey: e.target.value })}
              />
              <Input
                label="الترتيب"
                type="number"
                value={editing.order}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
              />
            </div>
            <Input
              label="لون التدرج (Tailwind classes)"
              dir="ltr"
              value={editing.color}
              onChange={(e) => setEditing({ ...editing, color: e.target.value })}
            />
            <FileUploadField
              label="صورة البرنامج"
              folder="programs"
              value={editing.imageUrl}
              onChange={(imageUrl) => setEditing({ ...editing, imageUrl })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.enabled}
                onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-border text-brand-green"
              />
              مفعّل
            </label>
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={!!deletingId}
        message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.title)}»؟`}
      />

      <AdminItemList
        items={items}
        emptyMessage="لا توجد برامج بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => pickAdminLabel(item.title)}
        renderSubtitle={(item) => `${item.iconKey} · ترتيب ${item.order}`}
      />
    </div>
  );
}
