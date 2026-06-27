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
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { TestimonialItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): TestimonialItem {
  return {
    id: "",
    name: emptyLocalized(),
    role: emptyLocalized(),
    quote: emptyLocalized(),
    imageUrl: "",
    youtubeUrl: "",
    enabled: true,
    order,
  };
}

export default function AdminTestimonialsPage() {
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
  } = useAdminCrud<TestimonialItem>({
    getCollection: () => api.getTestimonialsCollection(),
    getDocRef: (id) => api.getTestimonialDoc(id),
    newIdPrefix: "testimonials",
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
        title="آراء المستفيدين"
        description="إدارة شهادات المستفيدين والمانحين"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة شهادة
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل شهادة" : "شهادة جديدة"}
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
              label="الصفة"
              value={editing.role}
              onChange={(role) => setEditing({ ...editing, role })}
            />
            <LocalizedInput
              label="الاقتباس"
              value={editing.quote}
              onChange={(quote) => setEditing({ ...editing, quote })}
              multiline
            />
            <FileUploadField
              label="الصورة"
              folder="testimonials"
              value={editing.imageUrl}
              onChange={(imageUrl) => setEditing({ ...editing, imageUrl })}
            />
            <YouTubeField
              value={editing.youtubeUrl}
              onChange={(youtubeUrl) => setEditing({ ...editing, youtubeUrl })}
            />
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={!!deletingId}
        message={`هل أنت متأكد من حذف شهادة «${pickAdminLabel(deleteTarget?.name)}»؟`}
      />

      <AdminItemList
        items={items}
        emptyMessage="لا توجد شهادات بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => pickAdminLabel(item.name)}
        renderSubtitle={(item) => pickAdminLabel(item.role)}
      />
    </div>
  );
}
