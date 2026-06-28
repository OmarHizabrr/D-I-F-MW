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
import type { FooterContent, NavItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

const defaultFooter: FooterContent = {
  description: emptyLocalized(),
  address: emptyLocalized(),
  workingHours: emptyLocalized(),
  rights: emptyLocalized(),
  mapsUrl: "",
  quickLinkIds: [],
};

export default function AdminFooterPage() {
  const { user } = useAuth();
  const [data, setData] = useState<FooterContent>(defaultFooter);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api.getData(api.getFooterDoc()),
      api.getOrderedDocuments(api.getNavItemsCollection()),
    ]).then(([doc, navDocs]) => {
      if (cancelled) return;
      if (doc) {
        setData({
          description: (doc.description as FooterContent["description"]) ?? emptyLocalized(),
          address: (doc.address as FooterContent["address"]) ?? emptyLocalized(),
          workingHours: (doc.workingHours as FooterContent["workingHours"]) ?? emptyLocalized(),
          rights: (doc.rights as FooterContent["rights"]) ?? emptyLocalized(),
          mapsUrl: (doc.mapsUrl as string) ?? "",
          quickLinkIds: (doc.quickLinkIds as string[]) ?? [],
        });
      }
      setNavItems(navDocs.map((d) => api.docToData<NavItem>(d)));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleLink(id: string) {
    setData((prev) => ({
      ...prev,
      quickLinkIds: prev.quickLinkIds.includes(id)
        ? prev.quickLinkIds.filter((x) => x !== id)
        : [...prev.quickLinkIds, id],
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await api.setData({
        docRef: api.getFooterDoc(),
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
        title="التذييل"
        description="تعديل محتوى تذييل الموقع"
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
            label="وصف المؤسسة"
            value={data.description}
            onChange={(description) => setData({ ...data, description })}
            multiline
          />
          <LocalizedInput
            label="العنوان"
            value={data.address}
            onChange={(address) => setData({ ...data, address })}
          />
          <LocalizedInput
            label="أوقات العمل"
            value={data.workingHours}
            onChange={(workingHours) => setData({ ...data, workingHours })}
          />
          <LocalizedInput
            label="حقوق النشر"
            value={data.rights}
            onChange={(rights) => setData({ ...data, rights })}
          />
          <Input
            label="رابط Google Maps"
            dir="ltr"
            value={data.mapsUrl}
            onChange={(e) => setData({ ...data, mapsUrl: e.target.value })}
            hint="مثال: https://maps.app.goo.gl/..."
          />

          <div>
            <p className="mb-3 text-sm font-medium">روابط سريعة في التذييل</p>
            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={data.quickLinkIds.includes(item.id)}
                    onChange={() => toggleLink(item.id)}
                    className="h-4 w-4 rounded border-border text-brand-green"
                  />
                  {item.label.ar || item.label.en || item.id}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
