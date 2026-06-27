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
import type { WhyUsItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): WhyUsItem {
  return { id: "", title: emptyLocalized(), iconKey: "transparency", order, enabled: true };
}

export default function AdminWhyUsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<WhyUsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<WhyUsItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const docs = await api.getOrderedDocuments(api.getWhyUsCollection());
    setItems(docs.map((d) => api.docToData<WhyUsItem>(d)));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const id = editing.id || api.getNewId("why_us");
      await api.setData({
        docRef: api.getWhyUsDoc(id),
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
      await api.deleteData(api.getWhyUsDoc(id));
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
        title="لماذا نحن"
        description="إدارة نقاط القوة والتميز"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة نقطة
          </Button>
        }
      />

      {editing && (
        <Card className="mb-6" padding="lg">
          <CardTitle className="mb-4">{editing.id ? "تعديل" : "جديد"}</CardTitle>
          <CardContent className="flex flex-col gap-4">
            <LocalizedInput
              label="العنوان"
              value={editing.title}
              onChange={(title) => setEditing({ ...editing, title })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="مفتاح الأيقونة"
                value={editing.iconKey}
                onChange={(e) => setEditing({ ...editing, iconKey: e.target.value })}
              />
              <Input
                label="الترتيب"
                type="number"
                value={editing.order}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
              />
            </div>
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
              <p className="font-semibold">{item.title.ar || item.title.en}</p>
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
