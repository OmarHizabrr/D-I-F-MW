"use client";

import { useEffect, useState } from "react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { getDefaultPrivacy } from "@/data/trust-features-defaults";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { PrivacyPageContent } from "@/types/cms";

const api = FirestoreApi.Api;

export default function AdminPrivacyPage() {
  const { user } = useAuth();
  const [data, setData] = useState<PrivacyPageContent>(getDefaultPrivacy());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void api.getData(api.getPrivacyDoc()).then((doc) => {
      if (doc) setData({ ...getDefaultPrivacy(), ...(doc as PrivacyPageContent) });
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await api.setData({
        docRef: api.getPrivacyDoc(),
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
        title="سياسة الخصوصية"
        description="نص صفحة الخصوصية وتاريخ آخر تحديث"
        actions={<Button loading={saving} onClick={handleSave}>حفظ</Button>}
      />
      {message && (
        <p className="mb-4 rounded-xl bg-brand-green/10 px-4 py-3 text-sm text-brand-green-dark">
          {message}
        </p>
      )}
      <Card padding="lg">
        <CardContent className="flex flex-col gap-4">
          <LocalizedInput
            label="عنوان الصفحة (احتياطي)"
            value={data.title}
            onChange={(title) => setData({ ...data, title })}
          />
          <LocalizedInput
            label="الوصف (احتياطي)"
            value={data.subtitle}
            onChange={(subtitle) => setData({ ...data, subtitle })}
          />
          <LocalizedInput
            label="محتوى السياسة"
            value={data.body}
            onChange={(body) => setData({ ...data, body })}
            multiline
          />
          <Input
            label="تاريخ آخر تحديث"
            dir="ltr"
            value={data.lastUpdated}
            onChange={(e) => setData({ ...data, lastUpdated: e.target.value })}
            hint="مثال: 2026-06-27"
          />
        </CardContent>
      </Card>
    </div>
  );
}
