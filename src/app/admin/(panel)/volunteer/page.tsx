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
import { pickAdminLabel } from "@/lib/admin/pickAdminLabel";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { VolunteerOpportunity } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): VolunteerOpportunity {
  return {
    id: "",
    title: emptyLocalized(),
    description: emptyLocalized(),
    location: emptyLocalized(),
    commitment: emptyLocalized(),
    requirements: emptyLocalized(),
    enabled: true,
    order,
  };
}

export default function AdminVolunteerPage() {
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
  } = useAdminCrud<VolunteerOpportunity>({
    getCollection: () => api.getVolunteerOpportunitiesCollection(),
    getDocRef: (id) => api.getVolunteerOpportunityDoc(id),
    newIdPrefix: "volunteer",
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
        title="فرص التطوع"
        description="إدارة فرص التطوع المعروضة للزوار"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة فرصة
          </Button>
        }
      />

      <AdminFormDialog open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "تعديل فرصة" : "فرصة جديدة"} onSave={handleSave} saving={saving} size="lg">
        {editing && (
          <>
            <LocalizedInput label="المسمى" value={editing.title} onChange={(title) => setEditing({ ...editing, title })} />
            <LocalizedInput label="الوصف" value={editing.description} onChange={(description) => setEditing({ ...editing, description })} multiline />
            <LocalizedInput label="الموقع" value={editing.location} onChange={(location) => setEditing({ ...editing, location })} />
            <LocalizedInput label="الالتزام" value={editing.commitment} onChange={(commitment) => setEditing({ ...editing, commitment })} />
            <LocalizedInput label="المتطلبات" value={editing.requirements} onChange={(requirements) => setEditing({ ...editing, requirements })} multiline />
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} loading={!!deletingId} message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.title)}»؟`} />

      <AdminItemList items={items} emptyMessage="لا توجد فرص بعد" deletingId={deletingId} onEdit={setEditing} onDelete={setDeleteTarget} renderTitle={(item) => pickAdminLabel(item.title)} renderSubtitle={(item) => pickAdminLabel(item.location)} />
    </div>
  );
}
