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
  const [items, setItems] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StatItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const docs = await api.getOrderedDocuments(api.getStatsCollection());
    setItems(docs.map((d) => api.docToData<StatItem>(d)));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const id = editing.id || api.getNewId("stats");
      const payload = { ...editing, id };
      await api.setData({
        docRef: api.getStatDoc(id),
        data: payload,
        userData: { uid: user?.uid, displayName: user?.email ?? undefined },
      });
      setEditing(null);
      await loadItems();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;
    setDeletingId(id);
    try {
      await api.deleteData(api.getStatDoc(id));
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
        title="الإحصائيات"
        description="إدارة أرقام وإحصائيات الصفحة الرئيسية"
        actions={
          <Button onClick={() => setEditing(newStat(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة إحصائية
          </Button>
        }
      />

      {editing && (
        <Card className="mb-6" padding="lg">
          <CardTitle className="mb-4">
            {editing.id ? "تعديل إحصائية" : "إحصائية جديدة"}
          </CardTitle>
          <CardContent className="flex flex-col gap-4">
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

            <div className="flex gap-2">
              <Button loading={saving} loadingText="جاري الحفظ..." onClick={handleSave}>
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
        {items.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-muted-foreground">لا توجد إحصائيات بعد</p>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} hover={false} padding="md">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">
                    {item.label.ar || item.label.en || "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.value} · {item.iconKey} · ترتيب {item.order}
                    {!item.enabled && " · معطّل"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setEditing(item)}
                    aria-label="تعديل"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    loading={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                    aria-label="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
