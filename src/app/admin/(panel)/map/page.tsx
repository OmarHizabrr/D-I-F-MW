"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
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
  const [items, setItems] = useState<MapPointItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MapPointItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const docs = await api.getOrderedDocuments(api.getMapPointsCollection());
    setItems(docs.map((d) => api.docToData<MapPointItem>(d)));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const id = editing.id || api.getNewId("map_points");
      await api.setData({
        docRef: api.getMapPointDoc(id),
        data: { ...editing, id },
        userData: { uid: user?.uid, displayName: user?.email ?? undefined },
      });
      setEditing(null);
      await loadItems();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    setDeletingId(id);
    try {
      await api.deleteData(api.getMapPointDoc(id));
      await loadItems();
    } finally {
      setDeletingId(null);
    }
  }

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

      {editing && (
        <Card className="mb-6" padding="lg">
          <CardTitle className="mb-4">{editing.id ? "تعديل نقطة" : "نقطة جديدة"}</CardTitle>
          <CardContent className="flex flex-col gap-4">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <Input
                label="موقع X %"
                type="number"
                min={0}
                max={100}
                value={editing.mapX}
                onChange={(e) => setEditing({ ...editing, mapX: Number(e.target.value) })}
              />
              <Input
                label="موقع Y %"
                type="number"
                min={0}
                max={100}
                value={editing.mapY}
                onChange={(e) => setEditing({ ...editing, mapY: Number(e.target.value) })}
              />
            </div>
            <Input
              label="معرّف المشروع (اختياري)"
              dir="ltr"
              value={editing.projectId}
              onChange={(e) => setEditing({ ...editing, projectId: e.target.value })}
            />
            <div className="flex gap-2">
              <Button loading={saving} onClick={handleSave}>
                حفظ
              </Button>
              <Button variant="secondary" onClick={() => setEditing(null)}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} hover={false} padding="md">
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold">
                {item.name.ar || item.name.en} · ({item.mapX}%, {item.mapY}%)
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="icon" onClick={() => setEditing(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  loading={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
