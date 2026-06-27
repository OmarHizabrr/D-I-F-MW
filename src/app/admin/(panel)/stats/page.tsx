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
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { StatItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newStat(order: number): StatItem {
  return {
    id: "",
    iconKey: "users",
    value: 0,
    label: emptyLocalized(),
    order,
    enabled: true,
  };
}

export default function AdminStatsPage() {
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
  } = useAdminCrud<StatItem>({
    getCollection: () => api.getStatsCollection(),
    getDocRef: (id) => api.getStatDoc(id),
    newIdPrefix: "stats",
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
        title="الإحصائيات"
        description="إدارة أرقام وإحصائيات الصفحة الرئيسية"
        actions={
          <Button onClick={() => setEditing(newStat(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة إحصائية
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل إحصائية" : "إحصائية جديدة"}
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="مفتاح الأيقونة"
                value={editing.iconKey}
                onChange={(e) => setEditing({ ...editing, iconKey: e.target.value })}
                hint="مثال: users, projects"
              />
              <Input
                label="القيمة"
                type="number"
                value={editing.value}
                onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })}
              />
              <Input
                label="الترتيب"
                type="number"
                value={editing.order}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
              />
            </div>
            <LocalizedInput
              label="التسمية"
              value={editing.label}
              onChange={(label) => setEditing({ ...editing, label })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.enabled}
                onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-border text-brand-green focus:ring-brand-green"
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
        message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.label)}»؟`}
      />

      <AdminItemList
        items={items}
        emptyMessage="لا توجد إحصائيات بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => pickAdminLabel(item.label)}
        renderSubtitle={(item) =>
          `${item.value} · ${item.iconKey} · ترتيب ${item.order}${!item.enabled ? " · معطّل" : ""}`
        }
      />
    </div>
  );
}
