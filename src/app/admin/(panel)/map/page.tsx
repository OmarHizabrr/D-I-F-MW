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
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { MapPointItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newPoint(order: number): MapPointItem {
  return {
    id: "",
    name: emptyLocalized(),
    country: emptyLocalized(),
    lat: 0,
    lng: 0,
    mapX: 50,
    mapY: 50,
    projectId: "",
    order,
    enabled: true,
  };
}

export default function AdminMapPage() {
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
  } = useAdminCrud<MapPointItem>({
    getCollection: () => api.getMapPointsCollection(),
    getDocRef: (id) => api.getMapPointDoc(id),
    newIdPrefix: "map_points",
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
        title="خريطة المشاريع"
        description="إدارة نقاط المشاريع على الخريطة التفاعلية"
        actions={
          <Button onClick={() => setEditing(newPoint(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة نقطة
          </Button>
        }
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل نقطة" : "نقطة جديدة"}
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
            <LocalizedInput
              label="اسم المشروع"
              value={editing.name}
              onChange={(name) => setEditing({ ...editing, name })}
            />
            <LocalizedInput
              label="الدولة"
              value={editing.country}
              onChange={(country) => setEditing({ ...editing, country })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Latitude"
                type="number"
                dir="ltr"
                value={editing.lat}
                onChange={(e) => setEditing({ ...editing, lat: Number(e.target.value) })}
              />
              <Input
                label="Longitude"
                type="number"
                dir="ltr"
                value={editing.lng}
                onChange={(e) => setEditing({ ...editing, lng: Number(e.target.value) })}
              />
            </div>
            <RangeSlider
              label="موقع X على الخريطة"
              value={editing.mapX}
              onChange={(mapX) => setEditing({ ...editing, mapX })}
            />
            <RangeSlider
              label="موقع Y على الخريطة"
              value={editing.mapY}
              onChange={(mapY) => setEditing({ ...editing, mapY })}
            />
            <Input
              label="معرّف المشروع (اختياري)"
              dir="ltr"
              value={editing.projectId}
              onChange={(e) => setEditing({ ...editing, projectId: e.target.value })}
            />
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
        emptyMessage="لا توجد نقاط على الخريطة بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => pickAdminLabel(item.name)}
        renderSubtitle={(item) =>
          `${pickAdminLabel(item.country)} · (${item.mapX}%, ${item.mapY}%)`
        }
      />
    </div>
  );
}
