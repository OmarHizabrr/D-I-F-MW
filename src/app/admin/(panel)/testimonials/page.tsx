"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Check, Ban } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth, getUserMeta } from "@/context/AuthContext";
import {
  approveTestimonial,
  rejectTestimonial,
  banTestimonialUser,
  testimonialStatusLabel,
} from "@/services/testimonialService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { YouTubeField } from "@/components/admin/YouTubeField";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { pickAdminLabel } from "@/lib/admin/pickAdminLabel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import type { TestimonialItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

type FilterTab = "all" | "pending" | "published";

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
    source: "admin",
    status: "approved",
  };
}

export default function AdminTestimonialsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("all");
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const docs = await api.getOrderedDocuments(api.getTestimonialsCollection());
    setItems(docs.map((d) => api.docToData<TestimonialItem>(d)));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (tab === "pending") return item.status === "pending";
      if (tab === "published") return item.enabled && item.status !== "pending";
      return true;
    });
  }, [items, tab]);

  const pendingCount = items.filter((i) => i.status === "pending").length;

  async function handleSave() {
    if (!editing || !user) return;
    setSaving(true);
    try {
      const id = editing.id || api.getNewId("testimonials");
      const payload: TestimonialItem = {
        ...editing,
        id,
        source: editing.source || "admin",
        status: editing.status || "approved",
      };
      await api.setData({
        docRef: api.getTestimonialDoc(id),
        data: payload,
        userData: getUserMeta(user),
      });
      setEditing(null);
      await loadItems();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await rejectTestimonial(deleteTarget.id, getUserMeta(user));
      setDeleteTarget(null);
      await loadItems();
    } finally {
      setDeletingId(null);
    }
  }

  async function handleApprove(item: TestimonialItem) {
    setActionId(item.id);
    try {
      await approveTestimonial(item.id, getUserMeta(user));
      await loadItems();
    } finally {
      setActionId(null);
    }
  }

  async function handleBanUser(item: TestimonialItem) {
    if (!item.userId || !window.confirm("حظر هذا المستخدم من مشاركة آراء مستقبلية؟")) return;
    setActionId(item.id);
    try {
      await banTestimonialUser(item.userId, getUserMeta(user));
      await loadItems();
    } finally {
      setActionId(null);
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
        description="مراجعة آراء الزوار، الموافقة، الحذف، وحظر المستخدمين"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة شهادة
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "الكل"],
            ["pending", `بانتظار الموافقة${pendingCount ? ` (${pendingCount})` : ""}`],
            ["published", "منشور"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              tab === key
                ? "bg-brand-green text-white"
                : "bg-border-subtle text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل شهادة" : "شهادة جديدة"}
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
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
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={!!deletingId}
        message={`هل أنت متأكد من حذف شهادة «${pickAdminLabel(deleteTarget?.name)}»؟`}
      />

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-muted-foreground">لا توجد شهادات في هذا القسم</p>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card key={item.id} hover={false} padding="md">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-3">
                  <UserAvatar
                    name={pickAdminLabel(item.name)}
                    photoURL={item.imageUrl}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{pickAdminLabel(item.name)}</p>
                      <Badge
                        variant={
                          item.status === "pending"
                            ? "default"
                            : item.enabled
                              ? "success"
                              : "default"
                        }
                      >
                        {testimonialStatusLabel(item)}
                      </Badge>
                      {item.source === "public" && <Badge>من الزوار</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{pickAdminLabel(item.role)}</p>
                    <p className="mt-2 line-clamp-3 text-sm italic">
                      &ldquo;{pickAdminLabel(item.quote)}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-1.5">
                  {item.status === "pending" && (
                    <Button
                      size="sm"
                      loading={actionId === item.id}
                      onClick={() => handleApprove(item)}
                    >
                      <Check className="h-4 w-4" />
                      موافقة
                    </Button>
                  )}
                  {item.source === "public" && item.userId && (
                    <Button
                      variant="destructive"
                      size="sm"
                      loading={actionId === item.id}
                      onClick={() => handleBanUser(item)}
                    >
                      <Ban className="h-4 w-4" />
                      حظر
                    </Button>
                  )}
                  <Button variant="secondary" size="icon" onClick={() => setEditing(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    loading={deletingId === item.id}
                    onClick={() => setDeleteTarget(item)}
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
