"use client";

import { useEffect, useState } from "react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { getDefaultSectionTitles } from "@/data/default-content";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import type { LocalizedString } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

type SectionTitles = ReturnType<typeof getDefaultSectionTitles>;

const sectionGroups: { title: string; keys: (keyof SectionTitles)[] }[] = [
  {
    title: "الأقسام الرئيسية",
    keys: [
      "stats",
      "programs",
      "programsSubtitle",
      "projects",
      "projectsSubtitle",
      "howWeWork",
      "howWeWorkSubtitle",
      "whyUs",
      "whyUsSubtitle",
      "media",
      "mediaSubtitle",
      "news",
      "newsSubtitle",
      "partners",
      "partnersSubtitle",
      "testimonials",
      "testimonialsSubtitle",
      "licenses",
      "licensesSubtitle",
      "map",
      "mapSubtitle",
      "mapHint",
    ],
  },
  {
    title: "نصوص المشاريع والأزرار",
    keys: [
      "projectsCountry",
      "projectsProgress",
      "projectsLastUpdate",
      "projectsViewDetails",
      "projectsTableName",
      "newsReadMore",
      "licensesPdf",
      "programsViewProjects",
    ],
  },
  {
    title: "معرض الوسائط",
    keys: ["mediaTypePhoto", "mediaTypeVideo", "mediaTypeOpening", "mediaTypeVisit"],
  },
  {
    title: "التذييل",
    keys: ["footerQuickLinks", "footerContactInfo", "footerWorkingHours"],
  },
  {
    title: "صفحات الموقع",
    keys: [
      "aboutTitle",
      "aboutIntro",
      "teamTitle",
      "teamSubtitle",
      "contactTitle",
      "contactSubtitle",
      "storiesTitle",
      "storiesSubtitle",
      "contactFormName",
      "contactFormEmail",
      "contactFormMessage",
      "contactFormSubmit",
      "contactFormSuccess",
      "contactMapsLink",
      "shareStory",
      "navTeam",
      "navAllProjects",
      "navAboutOverview",
      "viewAll",
    ],
  },
];

const fieldLabels: Partial<Record<keyof SectionTitles, string>> = {
  stats: "عنوان الإحصائيات",
  programs: "عنوان البرامج",
  programsSubtitle: "وصف البرامج",
  projects: "عنوان المشاريع",
  projectsSubtitle: "وصف المشاريع",
  howWeWork: "عنوان كيف نعمل",
  howWeWorkSubtitle: "وصف كيف نعمل",
  whyUs: "عنوان لماذا نحن",
  whyUsSubtitle: "وصف لماذا نحن",
  media: "عنوان معرض الوسائط",
  mediaSubtitle: "وصف معرض الوسائط",
  news: "عنوان الأخبار",
  newsSubtitle: "وصف الأخبار",
  partners: "عنوان الشركاء",
  partnersSubtitle: "وصف الشركاء",
  testimonials: "عنوان آراء المستفيدين",
  testimonialsSubtitle: "وصف آراء المستفيدين",
  licenses: "عنوان التراخيص",
  licensesSubtitle: "وصف التراخيص",
  map: "عنوان الخريطة",
  mapSubtitle: "وصف الخريطة",
  mapHint: "تلميح الخريطة",
  projectsCountry: "تسمية الدولة",
  projectsProgress: "تسمية نسبة الإنجاز",
  projectsLastUpdate: "تسمية آخر تحديث",
  projectsViewDetails: "زر عرض التفاصيل",
  projectsTableName: "عمود اسم المشروع",
  newsReadMore: "زر اقرأ المزيد",
  licensesPdf: "زر PDF",
  programsViewProjects: "زر عرض مشاريع البرنامج",
  mediaTypePhoto: "نوع: صورة",
  mediaTypeVideo: "نوع: فيديو",
  mediaTypeOpening: "نوع: افتتاح",
  mediaTypeVisit: "نوع: زيارة",
  footerQuickLinks: "روابط سريعة",
  footerContactInfo: "معلومات التواصل",
  footerWorkingHours: "أوقات العمل",
  aboutTitle: "صفحة عن المؤسسة — العنوان",
  aboutIntro: "صفحة عن المؤسسة — المقدمة",
  teamTitle: "صفحة الفريق — العنوان",
  teamSubtitle: "صفحة الفريق — الوصف",
  contactTitle: "صفحة التواصل — العنوان",
  contactSubtitle: "صفحة التواصل — الوصف",
  storiesTitle: "صفحة القصص — العنوان",
  storiesSubtitle: "صفحة القصص — الوصف",
  contactFormName: "نموذج التواصل — الاسم",
  contactFormEmail: "نموذج التواصل — البريد",
  contactFormMessage: "نموذج التواصل — الرسالة",
  contactFormSubmit: "نموذج التواصل — زر الإرسال",
  contactFormSuccess: "نموذج التواصل — رسالة النجاح",
  contactMapsLink: "رابط الخريطة",
  shareStory: "زر شارك قصتك",
  navTeam: "القائمة — فريق العمل",
  navAllProjects: "القائمة — جميع المشاريع",
  navAboutOverview: "القائمة — نبذة عن المؤسسة",
  viewAll: "زر عرض الكل",
};

export default function AdminSectionsPage() {
  const { user } = useAuth();
  const [titles, setTitles] = useState<SectionTitles>(getDefaultSectionTitles());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const doc = await api.getData(api.getSiteConfigDoc());
        if (doc?.sectionTitles) {
          setTitles({ ...getDefaultSectionTitles(), ...(doc.sectionTitles as SectionTitles) });
        }
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  function updateKey(key: keyof SectionTitles, value: LocalizedString) {
    setTitles((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await api.setData({
        docRef: api.getSiteConfigDoc(),
        data: { sectionTitles: titles },
        merge: true,
        userData: { uid: user?.uid, displayName: user?.email ?? undefined },
      });
      setMessage("تم الحفظ بنجاح — التغييرات تظهر فوراً على الموقع");
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
        title="عناوين الأقسام"
        description="تحكم في جميع عناوين ونصوص الأقسام على الصفحة الرئيسية"
        actions={
          <Button loading={saving} onClick={handleSave}>
            حفظ جميع العناوين
          </Button>
        }
      />

      {message && (
        <p className="mb-4 rounded-xl bg-brand-green/10 px-4 py-3 text-sm text-brand-green-dark">
          {message}
        </p>
      )}

      <div className="space-y-6">
        {sectionGroups.map((group) => (
          <Card key={group.title} padding="lg">
            <CardTitle className="mb-4">{group.title}</CardTitle>
            <CardContent className="flex flex-col gap-4">
              {group.keys.map((key) => (
                <LocalizedInput
                  key={key}
                  label={fieldLabels[key] || key}
                  value={titles[key] || emptyLocalized()}
                  onChange={(value) => updateKey(key, value)}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
