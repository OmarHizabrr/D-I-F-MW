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
import { LocationPicker } from "@/components/admin/LocationPicker";
import { pickAdminLabel } from "@/lib/admin/pickAdminLabel";
import { formatCoordinates, isValidLatLng } from "@/lib/map/constants";
import { Input } from "@/components/ui/Input";
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
    lat: 15.35,
    lng: 44.2,
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
        description="حدد مواقع المشاريع الحقيقية على الخريطة — بحث، نقرة، أو إحداثيات GPS"
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
        description="اختر الموقع على الخريطة أو ابحث عن المكان"
        onSave={handleSave}
        saving={saving}
        size="full"
      >
        {editing && (
          <>
            <LocalizedInput
              label="اسم المشروع"
              value={editing.name}
              onChange={(name) => setEditing({ ...editing, name })}
            />
            <LocalizedInput
              label="الدولة / المنطقة"
              value={editing.country}
              onChange={(country) => setEditing({ ...editing, country })}
            />
            <LocationPicker
              lat={editing.lat}
              lng={editing.lng}
              onChange={(lat, lng) => setEditing({ ...editing, lat, lng })}
            />
            <Input
              label="معرّف المشروع (اختياري)"
              dir="ltr"
              value={editing.projectId}
              onChange={(e) => setEditing({ ...editing, projectId: e.target.value })}
              hint="لربط النقطة بمشروع من قائمة المشاريع"
            />
            {!isValidLatLng(editing.lat, editing.lng) && (
              <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
                يرجى تحديد موقع صالح على الخريطة قبل الحفظ
              </p>
            )}
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
          isValidLatLng(item.lat, item.lng)
            ? `${pickAdminLabel(item.country)} · ${formatCoordinates(item.lat, item.lng)}`
            : pickAdminLabel(item.country)
        }
      />
    </div>
  );
}
