"use client";

import { useEffect, useState } from "react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { getDefaultCampaignBanner } from "@/data/trust-features-defaults";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { CampaignBannerContent } from "@/types/cms";

const api = FirestoreApi.Api;

export default function AdminCampaignBannerPage() {
  const { user } = useAuth();
  const [data, setData] = useState<CampaignBannerContent>(getDefaultCampaignBanner());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void api.getData(api.getCampaignBannerDoc()).then((doc) => {
      if (doc) setData({ ...getDefaultCampaignBanner(), ...(doc as CampaignBannerContent) });
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await api.setData({
        docRef: api.getCampaignBannerDoc(),
        data,
        userData: { uid: user?.uid, displayName: user?.email ?? undefined },
      });
      setMessage("تم الحفظ بنجاح");
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
        title="بانر الحملات"
        description="شريط عاجل أو حملة تظهر أعلى الموقع"
        actions={<Button loading={saving} onClick={handleSave}>حفظ</Button>}
      />
      {message && (
        <p className="mb-4 rounded-xl bg-brand-green/10 px-4 py-3 text-sm">{message}</p>
      )}
      <Card padding="lg">
        <CardContent className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.enabled}
              onChange={(e) => setData({ ...data, enabled: e.target.checked })}
            />
            تفعيل البانر
          </label>
          <LocalizedInput label="الرسالة" value={data.message} onChange={(message) => setData({ ...data, message })} multiline />
          <LocalizedInput label="نص الرابط" value={data.linkLabel} onChange={(linkLabel) => setData({ ...data, linkLabel })} />
          <Input label="رابط الزر" dir="ltr" value={data.linkHref} onChange={(e) => setData({ ...data, linkHref: e.target.value })} />
          <Input label="تاريخ انتهاء (اختياري)" type="date" dir="ltr" value={data.endDate} onChange={(e) => setData({ ...data, endDate: e.target.value })} />
          <div className="flex w-full flex-col gap-1.5">
            <label className="text-sm font-medium">النوع</label>
            <select
              value={data.variant}
              onChange={(e) => setData({ ...data, variant: e.target.value as CampaignBannerContent["variant"] })}
              className="rounded-2xl border border-border px-4 py-3 text-sm"
            >
              <option value="urgent">عاجل</option>
              <option value="campaign">حملة</option>
              <option value="info">معلومات</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.dismissible}
              onChange={(e) => setData({ ...data, dismissible: e.target.checked })}
            />
            يمكن للزائر إغلاق البانر
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
