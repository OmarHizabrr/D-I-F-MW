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
import { IconPicker } from "@/components/admin/IconPicker";
import { pickAdminLabel } from "@/lib/admin/pickAdminLabel";
import { getIconOptionLabel } from "@/lib/admin/icon-options";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { HowWeWorkStep } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newStep(order: number): HowWeWorkStep {
  return {
    id: "",
    title: emptyLocalized(),
    description: emptyLocalized(),
    iconKey: "study",
    iconImageUrl: "",
    order,
    enabled: true,
  };
}

export default function AdminHowWeWorkPage() {
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
  } = useAdminCrud<HowWeWorkStep>({
    getCollection: () => api.getHowWeWorkCollection(),
    getDocRef: (id) => api.getHowWeWorkDoc(id),
    newIdPrefix: "how_we_work",
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
        title="كيف نعمل"
        description="إدارة خطوات العمل في المؤسسة"
        actions={
          <Button onClick={() => setEditing(newStep(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة خطوة
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل خطوة" : "خطوة جديدة"}
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
              <IconPicker
                label="الأيقونة"
                iconKey={editing.iconKey}
                iconImageUrl={editing.iconImageUrl || ""}
                onIconKeyChange={(iconKey) => setEditing({ ...editing, iconKey })}
                onIconImageChange={(iconImageUrl) => setEditing({ ...editing, iconImageUrl })}
                uploadFolder="icons/how-we-work"
              />
              <Input
                label="الترتيب"
                type="number"
                value={editing.order}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
              />
            </div>
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
        emptyMessage="لا توجد خطوات بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => pickAdminLabel(item.title)}
        renderSubtitle={(item) =>
          `${getIconOptionLabel([], item.iconKey)} · ترتيب ${item.order}`
        }
      />
    </div>
  );
}
