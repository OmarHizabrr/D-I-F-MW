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
import type { SuccessStoryItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): SuccessStoryItem {
  return {
    id: "",
    title: emptyLocalized(),
    excerpt: emptyLocalized(),
    body: emptyLocalized(),
    imageUrl: "",
    youtubeUrl: "",
    country: emptyLocalized(),
    programId: "",
    projectId: "",
    beneficiaries: emptyLocalized(),
    impactHighlight: emptyLocalized(),
    publishedAt: new Date().toISOString().slice(0, 10),
    featured: false,
    enabled: true,
    order,
  };
}

export default function AdminSuccessStoriesPage() {
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
  } = useAdminCrud<SuccessStoryItem>({
    getCollection: () => api.getSuccessStoriesCollection(),
    getDocRef: (id) => api.getSuccessStoryDoc(id),
    newIdPrefix: "success_stories",
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
        title="قصص النجاح"
        description="إدارة قصص النجاح والأثر الميداني"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة قصة
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل قصة" : "قصة جديدة"}
        onSave={handleSave}
        saving={saving}
        size="full"
      >
        {editing && (
          <>
            <LocalizedInput label="العنوان" value={editing.title} onChange={(title) => setEditing({ ...editing, title })} />
            <LocalizedInput label="المقتطف" value={editing.excerpt} onChange={(excerpt) => setEditing({ ...editing, excerpt })} multiline />
            <LocalizedInput label="المحتوى" value={editing.body} onChange={(body) => setEditing({ ...editing, body })} multiline />
            <LocalizedInput label="الدولة" value={editing.country} onChange={(country) => setEditing({ ...editing, country })} />
            <LocalizedInput label="المستفيدون" value={editing.beneficiaries} onChange={(beneficiaries) => setEditing({ ...editing, beneficiaries })} />
            <LocalizedInput label="الأثر" value={editing.impactHighlight} onChange={(impactHighlight) => setEditing({ ...editing, impactHighlight })} />
            <Input label="معرّف البرنامج" value={editing.programId} onChange={(e) => setEditing({ ...editing, programId: e.target.value })} />
            <Input label="معرّف المشروع" value={editing.projectId} onChange={(e) => setEditing({ ...editing, projectId: e.target.value })} />
            <Input label="تاريخ النشر" type="date" dir="ltr" value={editing.publishedAt} onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              مميزة في الصفحة الرئيسية
            </label>
            <FileUploadField label="صورة" folder="success-stories" value={editing.imageUrl} onChange={(imageUrl) => setEditing({ ...editing, imageUrl })} />
            <YouTubeField value={editing.youtubeUrl} onChange={(youtubeUrl) => setEditing({ ...editing, youtubeUrl })} />
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} loading={!!deletingId} message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.title)}»؟`} />

      <AdminItemList items={items} emptyMessage="لا توجد قصص بعد" deletingId={deletingId} onEdit={setEditing} onDelete={setDeleteTarget} renderTitle={(item) => pickAdminLabel(item.title)} renderSubtitle={(item) => `${item.publishedAt} · ${pickAdminLabel(item.country)}`} />
    </div>
  );
}
