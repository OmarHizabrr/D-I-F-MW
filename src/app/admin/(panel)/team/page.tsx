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
import type { TeamMember } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newMember(order: number): TeamMember {
  return {
    id: "",
    name: emptyLocalized(),
    role: emptyLocalized(),
    bio: emptyLocalized(),
    imageUrl: "",
    order,
    enabled: true,
  };
}

export default function AdminTeamPage() {
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
  } = useAdminCrud<TeamMember>({
    getCollection: () => api.getTeamCollection(),
    getDocRef: (id) => api.getTeamDoc(id),
    newIdPrefix: "team",
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
        title="فريق العمل"
        description="إدارة أعضاء الفريق في صفحة /about/team"
        actions={
          <Button onClick={() => setEditing(newMember(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة عضو
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل عضو" : "عضو جديد"}
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
            <LocalizedInput
              label="الاسم"
              value={editing.name}
              onChange={(name) => setEditing({ ...editing, name })}
            />
            <LocalizedInput
              label="المنصب"
              value={editing.role}
              onChange={(role) => setEditing({ ...editing, role })}
            />
            <LocalizedInput
              label="نبذة"
              value={editing.bio}
              onChange={(bio) => setEditing({ ...editing, bio })}
              multiline
            />
            <FileUploadField
              label="الصورة"
              folder="team"
              value={editing.imageUrl}
              onChange={(imageUrl) => setEditing({ ...editing, imageUrl })}
            />
            <Input
              label="الترتيب"
              type="number"
              value={editing.order}
              onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
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
        message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.name)}»؟`}
      />

      <AdminItemList
        items={items}
        emptyMessage="لا يوجد أعضاء فريق بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => pickAdminLabel(item.name)}
        renderSubtitle={(item) => `${pickAdminLabel(item.role)} · ترتيب ${item.order}`}
      />
    </div>
  );
}
