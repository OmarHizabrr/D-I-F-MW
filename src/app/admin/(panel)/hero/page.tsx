"use client";

import { useEffect, useState } from "react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { YouTubeField } from "@/components/admin/YouTubeField";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { HeroContent } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

const defaultHero: HeroContent = {
  title: emptyLocalized(),
  subtitle: emptyLocalized(),
  ctaProjects: emptyLocalized(),
  ctaTrack: emptyLocalized(),
  backgroundImageUrl: "",
  backgroundVideoUrl: "",
  youtubeUrl: "",
};

export default function AdminHeroPage() {
  const { user } = useAuth();
  const [data, setData] = useState<HeroContent>(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const doc = await api.getData(api.getHeroDoc());
        if (doc) {
          setData({
            title: (doc.title as HeroContent["title"]) ?? emptyLocalized(),
            subtitle: (doc.subtitle as HeroContent["subtitle"]) ?? emptyLocalized(),
            ctaProjects: (doc.ctaProjects as HeroContent["ctaProjects"]) ?? emptyLocalized(),
            ctaTrack: (doc.ctaTrack as HeroContent["ctaTrack"]) ?? emptyLocalized(),
            backgroundImageUrl: (doc.backgroundImageUrl as string) ?? "",
            backgroundVideoUrl: (doc.backgroundVideoUrl as string) ?? "",
            youtubeUrl: (doc.youtubeUrl as string) ?? "",
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
        docRef: api.getHeroDoc(),
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
        title="الواجهة الرئيسية"
        description="تعديل العنوان والأزرار وخلفية القسم الرئيسي"
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
          <LocalizedInput
            label="العنوان الرئيسي"
            value={data.title}
            onChange={(title) => setData({ ...data, title })}
          />

          <LocalizedInput
            label="العنوان الفرعي"
            value={data.subtitle}
            onChange={(subtitle) => setData({ ...data, subtitle })}
            multiline
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <LocalizedInput
              label="زر المشاريع"
              value={data.ctaProjects}
              onChange={(ctaProjects) => setData({ ...data, ctaProjects })}
            />
            <LocalizedInput
              label="زر التتبع"
              value={data.ctaTrack}
              onChange={(ctaTrack) => setData({ ...data, ctaTrack })}
            />
          </div>

          <FileUploadField
            label="صورة الخلفية"
            folder="hero"
            value={data.backgroundImageUrl}
            onChange={(backgroundImageUrl) => setData({ ...data, backgroundImageUrl })}
          />

          <FileUploadField
            label="فيديو الخلفية"
            folder="hero/videos"
            accept="video/*"
            value={data.backgroundVideoUrl}
            onChange={(backgroundVideoUrl) => setData({ ...data, backgroundVideoUrl })}
          />

          <YouTubeField
            value={data.youtubeUrl}
            onChange={(youtubeUrl) => setData({ ...data, youtubeUrl })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
