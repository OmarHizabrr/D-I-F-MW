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
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { NewsItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): NewsItem {
  return {
    id: "",
    title: emptyLocalized(),
    excerpt: emptyLocalized(),
    body: emptyLocalized(),
    category: emptyLocalized(),
    imageUrl: "",
    youtubeUrl: "",
    date: new Date().toISOString().slice(0, 10),
    enabled: true,
    order,
  };
}

export default function AdminNewsPage() {
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
  } = useAdminCrud<NewsItem>({
    getCollection: () => api.getNewsCollection(),
    getDocRef: (id) => api.getNewsDoc(id),
    newIdPrefix: "news",
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
        title="الأخبار"
        description="إدارة الأخبار والأنشطة"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة خبر
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل خبر" : "خبر جديد"}
        onSave={handleSave}
        saving={saving}
        size="full"
      >
        {editing && (
          <>
            <LocalizedInput
              label="العنوان"
              value={editing.title}
              onChange={(title) => setEditing({ ...editing, title })}
            />
            <LocalizedInput
              label="المقتطف"
              value={editing.excerpt}
              onChange={(excerpt) => setEditing({ ...editing, excerpt })}
              multiline
            />
            <LocalizedInput
              label="المحتوى"
              value={editing.body}
              onChange={(body) => setEditing({ ...editing, body })}
              multiline
            />
            <LocalizedInput
              label="التصنيف"
              value={editing.category}
              onChange={(category) => setEditing({ ...editing, category })}
            />
            <Input
              label="التاريخ"
              type="date"
              dir="ltr"
              value={editing.date}
              onChange={(e) => setEditing({ ...editing, date: e.target.value })}
            />
            <FileUploadField
              label="صورة الخبر"
              folder="news"
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
        message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.title)}»؟`}
      />

      <AdminItemList
        items={items}
        emptyMessage="لا توجد أخبار بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => pickAdminLabel(item.title)}
        renderSubtitle={(item) => `${item.date} · ${pickAdminLabel(item.category)}`}
      />
    </div>
  );
}
