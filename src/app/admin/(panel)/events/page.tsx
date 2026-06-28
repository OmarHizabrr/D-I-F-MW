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
import type { EventItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): EventItem {
  return {
    id: "",
    title: emptyLocalized(),
    excerpt: emptyLocalized(),
    body: emptyLocalized(),
    location: emptyLocalized(),
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    imageUrl: "",
    registrationUrl: "",
    enabled: true,
    order,
  };
}

export default function AdminEventsPage() {
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
  } = useAdminCrud<EventItem>({
    getCollection: () => api.getEventsCollection(),
    getDocRef: (id) => api.getEventDoc(id),
    newIdPrefix: "events",
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
        title="الفعاليات"
        description="إدارة الفعاليات والأنشطة"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة فعالية
          </Button>
        }
      />

      <AdminFormDialog open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "تعديل فعالية" : "فعالية جديدة"} onSave={handleSave} saving={saving} size="full">
        {editing && (
          <>
            <LocalizedInput label="العنوان" value={editing.title} onChange={(title) => setEditing({ ...editing, title })} />
            <LocalizedInput label="المقتطف" value={editing.excerpt} onChange={(excerpt) => setEditing({ ...editing, excerpt })} multiline />
            <LocalizedInput label="التفاصيل" value={editing.body} onChange={(body) => setEditing({ ...editing, body })} multiline />
            <LocalizedInput label="الموقع" value={editing.location} onChange={(location) => setEditing({ ...editing, location })} />
            <Input label="تاريخ البداية" type="date" dir="ltr" value={editing.startDate} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} />
            <Input label="تاريخ النهاية" type="date" dir="ltr" value={editing.endDate} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} />
            <Input label="رابط التسجيل" dir="ltr" value={editing.registrationUrl} onChange={(e) => setEditing({ ...editing, registrationUrl: e.target.value })} />
            <FileUploadField label="صورة" folder="events" value={editing.imageUrl} onChange={(imageUrl) => setEditing({ ...editing, imageUrl })} />
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} loading={!!deletingId} message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.title)}»؟`} />

      <AdminItemList items={items} emptyMessage="لا توجد فعاليات بعد" deletingId={deletingId} onEdit={setEditing} onDelete={setDeleteTarget} renderTitle={(item) => pickAdminLabel(item.title)} renderSubtitle={(item) => `${item.startDate} · ${pickAdminLabel(item.location)}`} />
    </div>
  );
}
