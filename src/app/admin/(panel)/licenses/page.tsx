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
import { getIconOptionLabel } from "@/lib/admin/icon-options";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { LicenseItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): LicenseItem {
  return {
    id: "",
    title: emptyLocalized(),
    pdfUrl: "",
    iconKey: "registration",
    iconImageUrl: "",
    enabled: true,
    order,
  };
}

export default function AdminLicensesPage() {
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
  } = useAdminCrud<LicenseItem>({
    getCollection: () => api.getLicensesCollection(),
    getDocRef: (id) => api.getLicenseDoc(id),
    newIdPrefix: "licenses",
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
        title="التراخيص"
        description="إدارة الشهادات والتراخيص والتقارير"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة وثيقة
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل وثيقة" : "وثيقة جديدة"}
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
            <IconPicker
              label="الأيقونة"
              iconKey={editing.iconKey}
              iconImageUrl={editing.iconImageUrl || ""}
              onIconKeyChange={(iconKey) => setEditing({ ...editing, iconKey })}
              onIconImageChange={(iconImageUrl) => setEditing({ ...editing, iconImageUrl })}
              uploadFolder="icons/licenses"
            />
            <FileUploadField
              label="ملف PDF"
              folder="licenses"
              accept="application/pdf,.pdf"
              value={editing.pdfUrl}
              onChange={(pdfUrl) => setEditing({ ...editing, pdfUrl })}
            />
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
        emptyMessage="لا توجد وثائق بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => pickAdminLabel(item.title)}
        renderSubtitle={(item) => getIconOptionLabel([], item.iconKey)}
      />
    </div>
  );
}
