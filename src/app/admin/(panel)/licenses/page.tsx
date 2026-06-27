"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { LicenseItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): LicenseItem {
  return {
    id: "",
    title: emptyLocalized(),
    pdfUrl: "",
    iconKey: "registration",
    enabled: true,
    order,
  };
}

export default function AdminLicensesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<LicenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LicenseItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const docs = await api.getOrderedDocuments(api.getLicensesCollection());
    setItems(docs.map((d) => api.docToData<LicenseItem>(d)));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const id = editing.id || api.getNewId("licenses");
      await api.setData({
        docRef: api.getLicenseDoc(id),
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
      await api.deleteData(api.getLicenseDoc(id));
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
        title="التراخيص"
        description="إدارة الشهادات والتراخيص والتقارير"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة وثيقة
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
            <Input
              label="مفتاح الأيقونة"
              value={editing.iconKey}
              onChange={(e) => setEditing({ ...editing, iconKey: e.target.value })}
            />
            <FileUploadField
              label="ملف PDF"
              folder="licenses"
              accept="application/pdf,.pdf"
              value={editing.pdfUrl}
              onChange={(pdfUrl) => setEditing({ ...editing, pdfUrl })}
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
