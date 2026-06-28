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
import type { FaqItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): FaqItem {
  return {
    id: "",
    question: emptyLocalized(),
    answer: emptyLocalized(),
    category: emptyLocalized(),
    order,
    enabled: true,
  };
}

export default function AdminFaqPage() {
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
  } = useAdminCrud<FaqItem>({
    getCollection: () => api.getFaqCollection(),
    getDocRef: (id) => api.getFaqDoc(id),
    newIdPrefix: "faq",
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
        title="الأسئلة الشائعة"
        description="إدارة الأسئلة والأجوبة"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة سؤال
          </Button>
        }
      />

      <AdminFormDialog open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "تعديل سؤال" : "سؤال جديد"} onSave={handleSave} saving={saving} size="lg">
        {editing && (
          <>
            <LocalizedInput label="السؤال" value={editing.question} onChange={(question) => setEditing({ ...editing, question })} />
            <LocalizedInput label="الجواب" value={editing.answer} onChange={(answer) => setEditing({ ...editing, answer })} multiline />
            <LocalizedInput label="التصنيف" value={editing.category} onChange={(category) => setEditing({ ...editing, category })} />
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} loading={!!deletingId} message={`هل أنت متأكد من حذف هذا السؤال؟`} />

      <AdminItemList items={items} emptyMessage="لا توجد أسئلة بعد" deletingId={deletingId} onEdit={setEditing} onDelete={setDeleteTarget} renderTitle={(item) => pickAdminLabel(item.question)} renderSubtitle={(item) => pickAdminLabel(item.category)} />
    </div>
  );
}
