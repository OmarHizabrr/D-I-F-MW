"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { ProjectItem, ProjectStatus } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "ongoing", label: "جاري" },
  { value: "completed", label: "مكتمل" },
  { value: "delayed", label: "متأخر" },
  { value: "needs_update", label: "يحتاج تحديث" },
];

function newProject(order: number): ProjectItem {
  return {
    id: "",
    code: "",
    name: emptyLocalized(),
    country: emptyLocalized(),
    city: "",
    programId: "",
    progress: 0,
    status: "ongoing",
    imageUrl: "",
    lastUpdate: new Date().toISOString().slice(0, 10),
    donorName: "",
    showDonor: false,
    enabled: true,
    order,
  };
}

export default function AdminProjectsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const docs = await api.getOrderedDocuments(api.getProjectsCollection());
    setItems(docs.map((d) => api.docToData<ProjectItem>(d)));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const id = editing.id || api.getNewId("projects");
      const payload = { ...editing, id };
      await api.setData({
        docRef: api.getProjectDoc(id),
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
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
    setDeletingId(id);
    try {
      await api.deleteData(api.getProjectDoc(id));
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
        title="المشاريع"
        description="إدارة قائمة المشاريع التنموية"
        actions={
          <Button onClick={() => setEditing(newProject(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة مشروع
          </Button>
        }
      />

      {editing && (
        <Card className="mb-6" padding="lg">
          <CardTitle className="mb-4">
            {editing.id ? "تعديل مشروع" : "مشروع جديد"}
          </CardTitle>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="رمز المشروع"
                dir="ltr"
                value={editing.code}
                onChange={(e) => setEditing({ ...editing, code: e.target.value })}
              />
              <Input
                label="المدينة"
                value={editing.city}
                onChange={(e) => setEditing({ ...editing, city: e.target.value })}
              />
            </div>

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

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="معرّف البرنامج"
                dir="ltr"
                value={editing.programId}
                onChange={(e) => setEditing({ ...editing, programId: e.target.value })}
              />
              <Input
                label="نسبة الإنجاز %"
                type="number"
                min={0}
                max={100}
                value={editing.progress}
                onChange={(e) => setEditing({ ...editing, progress: Number(e.target.value) })}
              />
              <Select
                label="الحالة"
                value={editing.status}
                onChange={(status) => setEditing({ ...editing, status: status as ProjectStatus })}
                options={statusOptions}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="اسم المتبرع"
                value={editing.donorName}
                onChange={(e) => setEditing({ ...editing, donorName: e.target.value })}
              />
              <Input
                label="آخر تحديث"
                type="date"
                dir="ltr"
                value={editing.lastUpdate}
                onChange={(e) => setEditing({ ...editing, lastUpdate: e.target.value })}
              />
            </div>

            <Input
              label="الترتيب"
              type="number"
              value={editing.order}
              onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
            />

            <FileUploadField
              label="صورة المشروع"
              folder="projects"
              value={editing.imageUrl}
              onChange={(imageUrl) => setEditing({ ...editing, imageUrl })}
            />

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.showDonor}
                  onChange={(e) => setEditing({ ...editing, showDonor: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-brand-green focus:ring-brand-green"
                />
                إظهار المتبرع
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.enabled}
                  onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-brand-green focus:ring-brand-green"
                />
                مفعّل
              </label>
            </div>

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
            <p className="text-center text-muted-foreground">لا توجد مشاريع بعد</p>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} hover={false} padding="md">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">
                    {item.name.ar || item.name.en || "—"}
                    {item.code && (
                      <span className="ms-2 text-xs font-normal text-muted-foreground">
                        ({item.code})
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.country.ar} · {item.city} · {item.progress}% ·{" "}
                    {statusOptions.find((s) => s.value === item.status)?.label}
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
