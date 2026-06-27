"use client";

import { useEffect, useState } from "react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { NewsletterContent } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

const defaultData: NewsletterContent = {
  title: emptyLocalized(),
  subtitle: emptyLocalized(),
  placeholder: emptyLocalized(),
  buttonLabel: emptyLocalized(),
};

export default function AdminNewsletterPage() {
  const { user } = useAuth();
  const [data, setData] = useState<NewsletterContent>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const doc = await api.getData(api.getNewsletterDoc());
        if (doc) {
          setData({
            title: (doc.title as NewsletterContent["title"]) ?? emptyLocalized(),
            subtitle: (doc.subtitle as NewsletterContent["subtitle"]) ?? emptyLocalized(),
            placeholder: (doc.placeholder as NewsletterContent["placeholder"]) ?? emptyLocalized(),
            buttonLabel: (doc.buttonLabel as NewsletterContent["buttonLabel"]) ?? emptyLocalized(),
          });
        }
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

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
        description="تعديل نصوص قسم الاشتراك في النشرة"
        actions={
          <Button loading={saving} onClick={handleSave}>
            حفظ التغييرات
          </Button>
        }
      />

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
        </CardContent>
      </Card>
    </div>
  );
}
