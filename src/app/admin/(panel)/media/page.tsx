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
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { MediaItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

const typeOptions = [
  { value: "photo", label: "صورة" },
  { value: "video", label: "فيديو" },
  { value: "opening", label: "افتتاح" },
  { value: "visit", label: "زيارة ميدانية" },
];

function newItem(order: number): MediaItem {
  return {
    id: "",
    type: "photo",
    title: emptyLocalized(),
    imageUrl: "",
    youtubeUrl: "",
    enabled: true,
    order,
  };
}

export default function AdminMediaPage() {
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
  } = useAdminCrud<MediaItem>({
    getCollection: () => api.getMediaCollection(),
    getDocRef: (id) => api.getMediaDoc(id),
    newIdPrefix: "media",
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
        title="معرض الوسائط"
        description="إدارة الصور والفيديوهات في المعرض المتحرك"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة وسائط
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل وسائط" : "وسائط جديدة"}
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
            <Select
              label="النوع"
              value={editing.type}
              onChange={(type) => setEditing({ ...editing, type: type as MediaItem["type"] })}
              options={typeOptions}
            />
            <LocalizedInput
              label="العنوان"
              value={editing.title}
              onChange={(title) => setEditing({ ...editing, title })}
            />
            <FileUploadField
              label="الصورة"
              folder="media"
              value={editing.imageUrl}
              onChange={(imageUrl) => setEditing({ ...editing, imageUrl })}
            />
            <YouTubeField
              value={editing.youtubeUrl}
              onChange={(youtubeUrl) => setEditing({ ...editing, youtubeUrl })}
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
        message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.title) || deleteTarget?.type}»؟`}
      />

      <AdminItemList
        items={items}
        emptyMessage="لا توجد وسائط بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => pickAdminLabel(item.title) || item.type}
        renderSubtitle={(item) => `${typeOptions.find((t) => t.value === item.type)?.label} · ترتيب ${item.order}`}
      />
    </div>
  );
}
