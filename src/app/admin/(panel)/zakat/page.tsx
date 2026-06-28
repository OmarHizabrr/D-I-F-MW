"use client";

import { useEffect, useState } from "react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { getDefaultZakatSettings } from "@/data/trust-features-defaults";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { ZakatSettings } from "@/types/cms";

const api = FirestoreApi.Api;

export default function AdminZakatPage() {
  const { user } = useAuth();
  const [data, setData] = useState<ZakatSettings>(getDefaultZakatSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void api.getData(api.getZakatSettingsDoc()).then((doc) => {
      if (doc) setData({ ...getDefaultZakatSettings(), ...(doc as ZakatSettings) });
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await api.setData({
      docRef: api.getZakatSettingsDoc(),
      data,
      userData: { uid: user?.uid, displayName: user?.email ?? undefined },
    });
    setSaving(false);
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
        title="حاسبة الزكاة"
        description="إعدادات النصاب وأسعار الذهب والفضة ونصوص الصفحة"
        actions={<Button loading={saving} onClick={handleSave}>حفظ</Button>}
      />
      <Card padding="lg">
        <CardContent className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.enabled} onChange={(e) => setData({ ...data, enabled: e.target.checked })} />
            تفعيل صفحة حاسبة الزكاة
          </label>
          <LocalizedInput label="عنوان الصفحة" value={data.pageTitle} onChange={(pageTitle) => setData({ ...data, pageTitle })} />
          <LocalizedInput label="الوصف" value={data.pageSubtitle} onChange={(pageSubtitle) => setData({ ...data, pageSubtitle })} />
          <LocalizedInput label="مقدمة" value={data.pageIntro} onChange={(pageIntro) => setData({ ...data, pageIntro })} multiline />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="سعر الذهب/غرام" type="number" dir="ltr" value={data.goldPricePerGram} onChange={(e) => setData({ ...data, goldPricePerGram: Number(e.target.value) })} />
            <Input label="سعر الفضة/غرام" type="number" dir="ltr" value={data.silverPricePerGram} onChange={(e) => setData({ ...data, silverPricePerGram: Number(e.target.value) })} />
            <Input label="نصاب الذهب (غرام)" type="number" dir="ltr" value={data.nisabGoldGrams} onChange={(e) => setData({ ...data, nisabGoldGrams: Number(e.target.value) })} />
            <Input label="نصاب الفضة (غرام)" type="number" dir="ltr" value={data.nisabSilverGrams} onChange={(e) => setData({ ...data, nisabSilverGrams: Number(e.target.value) })} />
            <Input label="رمز العملة" dir="ltr" value={data.currencySymbol} onChange={(e) => setData({ ...data, currencySymbol: e.target.value })} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
