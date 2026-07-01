"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import {
  saveProjectSubItem,
  deleteProjectSubItem,
} from "@/services/projectManagementService";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { FORM_PLACEHOLDERS } from "@/lib/admin/form-placeholders";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  PROJECT_SUBCOLLECTIONS,
  type ProjectUpdate,
} from "@/types/project-management";
import type { UserMeta } from "@/services/firestoreApi";

type AdminProjectUpdatesTabProps = {
  projectId: string;
  updates: ProjectUpdate[];
  userMeta: UserMeta | null;
  onReload: () => Promise<void>;
};

const emptyForm = (): Partial<ProjectUpdate> => ({
  title: "",
  description: "",
  images: [],
  videos: [],
});

export function AdminProjectUpdatesTab({
  projectId,
  updates,
  userMeta,
  onReload,
}: AdminProjectUpdatesTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<ProjectUpdate>>(emptyForm());
  const [saving, setSaving] = useState(false);

  const sorted = [...updates].sort((a, b) =>
    (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
  );

  function openCreate() {
    setForm(emptyForm());
    setDialogOpen(true);
  }

  function openEdit(update: ProjectUpdate) {
    setForm({ ...update });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!userMeta || !form.title?.trim()) return;
    setSaving(true);
    try {
      await saveProjectSubItem(
        projectId,
        PROJECT_SUBCOLLECTIONS.updates,
        {
          id: form.id,
          title: form.title.trim(),
          description: form.description?.trim() ?? "",
          images: form.images ?? [],
          videos: form.videos ?? [],
          createdBy: form.createdBy ?? userMeta.uid,
        },
        userMeta,
        "update"
      );
      setDialogOpen(false);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(updateId: string) {
    if (!userMeta || !confirm("حذف هذا التحديث؟")) return;
    setSaving(true);
    try {
      await deleteProjectSubItem(projectId, PROJECT_SUBCOLLECTIONS.updates, updateId);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  function addImage(url: string) {
    if (!url) return;
    setForm((prev) => ({ ...prev, images: [...(prev.images ?? []), url] }));
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: (prev.images ?? []).filter((_, i) => i !== index),
    }));
  }

  function addVideo(url: string) {
    if (!url) return;
    setForm((prev) => ({ ...prev, videos: [...(prev.videos ?? []), url] }));
  }

  function removeVideo(index: number) {
    setForm((prev) => ({
      ...prev,
      videos: (prev.videos ?? []).filter((_, i) => i !== index),
    }));
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        أضف تحديثات مستمرة للمشروع — نبذة مختصرة مع صور أو فيديوهات توثّق سير العمل. تظهر
        مباشرة على الموقع وفي بوابة المتبرع.
      </p>
      <Button className="mb-4" onClick={openCreate}>
        <Plus className="h-4 w-4" />
        تحديث جديد
      </Button>

      <div className="space-y-3">
        {sorted.map((update) => (
          <Card key={update.id} padding="md">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{update.title}</p>
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                  {update.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {update.createdAt?.slice(0, 10)}
                  {(update.images?.length ?? 0) > 0 && ` · ${update.images.length} صورة`}
                  {(update.videos?.length ?? 0) > 0 && ` · ${update.videos.length} فيديو`}
                </p>
                {update.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {update.images.map((src, i) => (
                      <div
                        key={i}
                        className="relative h-16 w-16 overflow-hidden rounded-lg border border-border-subtle"
                      >
                        <Image src={src} alt="" fill className="object-cover" unoptimized />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEdit(update)}>
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  loading={saving}
                  onClick={() => void handleDelete(update.id)}
                >
                  حذف
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {sorted.length === 0 && (
          <Card padding="lg">
            <p className="text-center text-sm text-muted-foreground">
              لا توجد تحديثات بعد — أضف أول تحديث ليبدأ المتبرع بمتابعة المشروع
            </p>
          </Card>
        )}
      </div>

      <AdminFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={form.id ? "تعديل التحديث" : "تحديث جديد"}
        onSave={handleSave}
        saving={saving}
      >
        <Input
          label="عنوان التحديث"
          placeholder="مثال: تم الانتهاء من مرحلة الحفر"
          value={form.title ?? ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">نبذة مختصرة</label>
          <textarea
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="وصلنا في المشروع إلى هذه المرحلة..."
            rows={4}
            className="w-full rounded-2xl border border-border bg-input-bg px-4 py-3 text-sm focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">صور التحديث</p>
          {form.images && form.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.images.map((src, index) => (
                <div key={index} className="relative h-20 w-20 overflow-hidden rounded-lg">
                  <Image src={src} alt="" fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    className="absolute end-0 top-0 rounded-bl bg-destructive p-1 text-white"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <FileUploadField
            label="إضافة صور (يمكن اختيار أكثر من صورة)"
            value=""
            folder={`projects/${projectId}/updates`}
            multiple
            accept="image/*"
            onChange={addImage}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">فيديوهات التحديث (رابط YouTube أو ملف)</p>
          {form.videos && form.videos.length > 0 && (
            <div className="space-y-2">
              {form.videos.map((url, index) => (
                <div key={index} className="flex items-center gap-2 rounded-lg bg-border-subtle/50 px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-xs" dir="ltr">
                    {url}
                  </span>
                  <button type="button" onClick={() => removeVideo(index)}>
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <Input
            label="رابط فيديو (YouTube أو رابط مباشر)"
            placeholder={FORM_PLACEHOLDERS.project.videoUrl}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const input = e.currentTarget;
                if (input.value.trim()) {
                  addVideo(input.value.trim());
                  input.value = "";
                }
              }
            }}
          />
          <p className="text-xs text-muted-foreground">اضغط Enter لإضافة الرابط</p>
          <FileUploadField
            label="أو رفع ملف فيديو"
            value=""
            folder={`projects/${projectId}/updates/videos`}
            accept="video/*,.mp4,.webm"
            onChange={addVideo}
          />
        </div>
      </AdminFormDialog>
    </div>
  );
}
