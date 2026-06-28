"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, Mail } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import {
  deleteContactMessage,
  markContactMessageRead,
} from "@/services/contactService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import type { ContactMessage } from "@/types/cms";
import { cn } from "@/lib/utils";

const api = FirestoreApi.Api;

type FilterTab = "all" | "unread" | "read";

export default function AdminContactMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      const docs = await api.getOrderedDocuments(api.getContactMessagesCollection());
      const list = docs
        .map((d) => api.docToData<ContactMessage>(d))
        .sort((a, b) => (b.submittedAt || "").localeCompare(a.submittedAt || ""));
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const filtered = items.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "read") return item.read;
    return true;
  });

  async function handleOpen(item: ContactMessage) {
    setSelected(item);
    if (!item.read) {
      await markContactMessageRead(item.id);
      setItems((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, read: true } : m))
      );
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteContactMessage(deleteTarget.id);
      if (selected?.id === deleteTarget.id) setSelected(null);
      setDeleteTarget(null);
      await loadItems();
    } finally {
      setDeleting(false);
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
        title="رسائل التواصل"
        description="رسائل نموذج تواصل معنا من الموقع"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { key: "all", label: "الكل" },
            { key: "unread", label: "غير مقروءة" },
            { key: "read", label: "مقروءة" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm",
              filter === tab.key
                ? "bg-brand-green text-white"
                : "bg-border-subtle text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">لا توجد رسائل</Card>
          ) : (
            filtered.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "cursor-pointer p-4 transition-colors hover:bg-brand-green/5",
                  selected?.id === item.id && "ring-2 ring-brand-green/30",
                  !item.read && "border-brand-green/30 bg-brand-green/5"
                )}
                onClick={() => void handleOpen(item)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold">{item.name}</p>
                    <p className="truncate text-xs text-muted-foreground" dir="ltr">
                      {item.email}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {item.message}
                    </p>
                  </div>
                  {!item.read && <Badge variant="success">جديد</Badge>}
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  {item.submittedAt ? new Date(item.submittedAt).toLocaleString("ar") : "—"}
                </p>
              </Card>
            ))
          )}
        </div>

        <Card className="min-h-[280px] p-6">
          {selected ? (
            <>
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold">{selected.name}</h3>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sm text-brand-green hover:underline"
                    dir="ltr"
                  >
                    {selected.email}
                  </a>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`mailto:${selected.email}`, "_blank")}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteTarget(selected)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {selected.message}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                {selected.submittedAt
                  ? new Date(selected.submittedAt).toLocaleString("ar")
                  : "—"}
              </p>
            </>
          ) : (
            <p className="flex h-full min-h-[200px] items-center justify-center text-sm text-muted-foreground">
              اختر رسالة لعرض التفاصيل
            </p>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        message="هل أنت متأكد من حذف هذه الرسالة؟"
      />
    </div>
  );
}
