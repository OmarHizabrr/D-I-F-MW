"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { getDefaultNewsletter } from "@/data/default-content";
import { deleteNewsletterSubscriber } from "@/services/newsletterService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { NewsletterContent, NewsletterSubscriber } from "@/types/cms";
import { cn } from "@/lib/utils";

const api = FirestoreApi.Api;

export default function AdminNewsletterPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"settings" | "subscribers">("settings");
  const [data, setData] = useState<NewsletterContent>(getDefaultNewsletter());
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadSubscribers = useCallback(async () => {
    const docs = await api.getOrderedDocuments(api.getNewsletterSubscribersCollection());
    setSubscribers(
      docs
        .map((d) => api.docToData<NewsletterSubscriber>(d))
        .sort((a, b) => (b.subscribedAt || "").localeCompare(a.subscribedAt || ""))
    );
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const doc = await api.getData(api.getNewsletterDoc());
        if (doc) {
          setData({ ...getDefaultNewsletter(), ...(doc as NewsletterContent) });
        }
        await loadSubscribers();
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [loadSubscribers]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await api.setData({
        docRef: api.getNewsletterDoc(),
        data,
        userData: { uid: user?.uid, displayName: user?.email ?? undefined },
      });
      setMessage("تم الحفظ بنجاح");
    } catch {
      setMessage("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteNewsletterSubscriber(deleteTarget.id);
      setDeleteTarget(null);
      await loadSubscribers();
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
        title="النشرة البريدية"
        description="نصوص الاشتراك ومشتركو النشرة"
        actions={
          tab === "settings" ? (
            <Button loading={saving} onClick={handleSave}>
              حفظ التغييرات
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 flex gap-2">
        {(
          [
            { key: "settings", label: "الإعدادات" },
            { key: "subscribers", label: `المشتركون (${subscribers.length})` },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium",
              tab === t.key
                ? "bg-brand-green text-white"
                : "bg-border-subtle text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "subscribers" ? (
        subscribers.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">لا يوجد مشتركون بعد</Card>
        ) : (
          <div className="space-y-2">
            {subscribers.map((sub) => (
              <Card key={sub.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p dir="ltr" className="font-medium">
                    {sub.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sub.subscribedAt
                      ? new Date(sub.subscribedAt).toLocaleString("ar")
                      : "—"}
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(sub)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </Card>
            ))}
          </div>
        )
      ) : (
        <>
          {message && (
            <p className="mb-4 rounded-xl bg-brand-green/10 px-4 py-3 text-sm text-brand-green-dark">
              {message}
            </p>
          )}
          <Card padding="lg">
            <CardContent className="flex flex-col gap-6">
              <LocalizedInput
                label="العنوان"
                value={data.title}
                onChange={(title) => setData({ ...data, title })}
              />
              <LocalizedInput
                label="العنوان الفرعي"
                value={data.subtitle}
                onChange={(subtitle) => setData({ ...data, subtitle })}
                multiline
              />
              <LocalizedInput
                label="نص الحقل"
                value={data.placeholder}
                onChange={(placeholder) => setData({ ...data, placeholder })}
              />
              <LocalizedInput
                label="زر الاشتراك"
                value={data.buttonLabel}
                onChange={(buttonLabel) => setData({ ...data, buttonLabel })}
              />
              <LocalizedInput
                label="رسالة النجاح"
                value={data.successMessage}
                onChange={(successMessage) => setData({ ...data, successMessage })}
              />
              <LocalizedInput
                label="رسالة الاشتراك المكرر"
                value={data.duplicateMessage}
                onChange={(duplicateMessage) => setData({ ...data, duplicateMessage })}
              />
            </CardContent>
          </Card>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        message={`هل أنت متأكد من حذف «${deleteTarget?.email}»؟`}
      />
    </div>
  );
}
