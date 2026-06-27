"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { YouTubeField } from "@/components/admin/YouTubeField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { TestimonialItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): TestimonialItem {
  return {
    id: "",
    name: emptyLocalized(),
    role: emptyLocalized(),
    quote: emptyLocalized(),
    imageUrl: "",
    youtubeUrl: "",
    enabled: true,
    order,
  };
}

export default function AdminTestimonialsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const docs = await api.getOrderedDocuments(api.getTestimonialsCollection());
    setItems(docs.map((d) => api.docToData<TestimonialItem>(d)));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const id = editing.id || api.getNewId("testimonials");
      await api.setData({
        docRef: api.getTestimonialDoc(id),
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
      await api.deleteData(api.getTestimonialDoc(id));
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
        title="آراء المستفيدين"
        description="إدارة شهادات المستفيدين والمانحين"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة شهادة
          </Button>
        }
      />

      {editing && (
        <Card className="mb-6" padding="lg">
          <CardTitle className="mb-4">{editing.id ? "تعديل" : "جديد"}</CardTitle>
          <CardContent className="flex flex-col gap-4">
            <LocalizedInput
              label="الاسم"
              value={editing.name}
              onChange={(name) => setEditing({ ...editing, name })}
            />
            <LocalizedInput
              label="الصفة"
              value={editing.role}
              onChange={(role) => setEditing({ ...editing, role })}
            />
            <LocalizedInput
              label="الاقتباس"
              value={editing.quote}
              onChange={(quote) => setEditing({ ...editing, quote })}
              multiline
            />
            <FileUploadField
              label="الصورة"
              folder="testimonials"
              value={editing.imageUrl}
              onChange={(imageUrl) => setEditing({ ...editing, imageUrl })}
            />
            <YouTubeField
              value={editing.youtubeUrl}
              onChange={(youtubeUrl) => setEditing({ ...editing, youtubeUrl })}
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
              <p className="font-semibold">{item.name.ar || item.name.en}</p>
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
