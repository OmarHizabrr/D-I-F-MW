"use client";

import { Plus } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminItemList } from "@/components/admin/AdminItemList";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { PartnerItem } from "@/types/cms";

const api = FirestoreApi.Api;

function newPartner(order: number): PartnerItem {
  return { id: "", name: "", logoUrl: "", websiteUrl: "", enabled: true, order };
}

export default function AdminPartnersPage() {
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
  } = useAdminCrud<PartnerItem>({
    getCollection: () => api.getPartnersCollection(),
    getDocRef: (id) => api.getPartnerDoc(id),
    newIdPrefix: "partners",
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
        title="الشركاء"
        description="إدارة شعارات الشركاء والداعمين"
        actions={
          <Button onClick={() => setEditing(newPartner(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة شريك
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل شريك" : "شريك جديد"}
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
            <Input
              label="اسم الشريك"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <Input
              label="الموقع الإلكتروني"
              dir="ltr"
              value={editing.websiteUrl}
              onChange={(e) => setEditing({ ...editing, websiteUrl: e.target.value })}
            />
            <FileUploadField
              label="الشعار"
              folder="partners"
              value={editing.logoUrl}
              onChange={(logoUrl) => setEditing({ ...editing, logoUrl })}
            />
            <Input
              label="الترتيب"
              type="number"
              value={editing.order}
              onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
            />
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={!!deletingId}
        message={`هل أنت متأكد من حذف «${deleteTarget?.name || "هذا الشريك"}»؟`}
      />

      <AdminItemList
        items={items}
        emptyMessage="لا يوجد شركاء بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => item.name || "—"}
        renderSubtitle={(item) => `ترتيب ${item.order}`}
      />
    </div>
  );
}
