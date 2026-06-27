"use client";

import { useEffect, useState } from "react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { TopbarContent } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

const defaultTopbar: TopbarContent = {
  phone: "",
  email: "",
  donorPortalLabel: emptyLocalized(),
  loginLabel: emptyLocalized(),
  socialLinks: [],
};

export default function AdminTopbarPage() {
  const { user } = useAuth();
  const [data, setData] = useState<TopbarContent>(defaultTopbar);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const doc = await api.getData(api.getTopbarDoc());
        if (doc) {
          setData({
            phone: (doc.phone as string) ?? "",
            email: (doc.email as string) ?? "",
            donorPortalLabel: (doc.donorPortalLabel as TopbarContent["donorPortalLabel"]) ?? emptyLocalized(),
            loginLabel: (doc.loginLabel as TopbarContent["loginLabel"]) ?? emptyLocalized(),
            socialLinks: (doc.socialLinks as TopbarContent["socialLinks"]) ?? [],
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
        docRef: api.getTopbarDoc(),
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
        title="الشريط العلوي"
        description="تعديل بيانات الاتصال والروابط في الشريط العلوي"
        actions={
          <Button loading={saving} loadingText="جاري الحفظ..." onClick={handleSave}>
            حفظ التغييرات
          </Button>
        }
      />

      {message && (
        <p className="mb-4 rounded-xl bg-brand-green/10 px-4 py-3 text-sm text-brand-green-dark dark:text-brand-green">
          {message}
        </p>
      )}

      <Card padding="lg">
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="رقم الهاتف"
              dir="ltr"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
            <Input
              label="البريد الإلكتروني"
              type="email"
              dir="ltr"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          <LocalizedInput
            label="نص بوابة المتبرعين"
            value={data.donorPortalLabel}
            onChange={(donorPortalLabel) => setData({ ...data, donorPortalLabel })}
          />

          <LocalizedInput
            label="نص تسجيل الدخول"
            value={data.loginLabel}
            onChange={(loginLabel) => setData({ ...data, loginLabel })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
