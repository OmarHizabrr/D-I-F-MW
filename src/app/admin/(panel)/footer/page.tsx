"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { getDefaultFooter, getDefaultPrograms } from "@/data/default-content";
import { buildFooterLinkGroups, footerUsesGroupedLinks, navHasDropdown } from "@/lib/nav-utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { pickAdminLabel } from "@/lib/admin/pickAdminLabel";
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
  showHomeLink: true,
};

const defaultNavLabels = {
  aboutOverview: { ar: "نبذة", en: "About", ny: "Za" },
  team: { ar: "الفريق", en: "Team", ny: "Gulu" },
  faq: { ar: "FAQ", en: "FAQ", ny: "FAQ" },
  ourWork: { ar: "أعمالنا", en: "Our Work", ny: "Ntchito" },
  allProjects: { ar: "المشاريع", en: "Projects", ny: "Mapulojekiti" },
  successStories: { ar: "قصص النجاح", en: "Success", ny: "Nkhani" },
  stories: { ar: "قصصنا", en: "Stories", ny: "Nkhani" },
  news: { ar: "أخبار", en: "News", ny: "Nkhani" },
  events: { ar: "فعاليات", en: "Events", ny: "Zochitika" },
  media: { ar: "وسائط", en: "Media", ny: "Media" },
  volunteer: { ar: "تطوع", en: "Volunteer", ny: "Kuthandiza" },
  contact: { ar: "تواصل", en: "Contact", ny: "Contact" },
  shareStory: { ar: "شارك قصتك", en: "Share", ny: "Gawani" },
  resources: { ar: "موارد", en: "Resources", ny: "Zothandizira" },
  transparency: { ar: "الشفافية", en: "Transparency", ny: "Kuwonekera" },
  zakatCalculator: { ar: "حاسبة الزكاة", en: "Zakat Calculator", ny: "Zakat" },
  waysToGive: { ar: "طرق التبرع", en: "Ways to Give", ny: "Kupereka" },
  privacy: { ar: "الخصوصية", en: "Privacy", ny: "Chinsinsi" },
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
          showHomeLink: doc.showHomeLink !== false,
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

  function handleRestoreQuickLinks() {
    const defaults = getDefaultFooter();
    setData((prev) => ({
      ...prev,
      quickLinkIds: defaults.quickLinkIds,
      showHomeLink: defaults.showHomeLink !== false,
    }));
    setMessage("تم استعادة مجموعات روابط التذييل الافتراضية — احفظ لتطبيقها");
  }

  const groupedPreview = footerUsesGroupedLinks(data.quickLinkIds)
    ? buildFooterLinkGroups(navItems, getDefaultPrograms(), defaultNavLabels, data.quickLinkIds)
    : [];

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

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.showHomeLink !== false}
              onChange={(e) => setData({ ...data, showHomeLink: e.target.checked })}
              className="h-4 w-4 rounded border-border text-brand-green"
            />
            إظهار رابط «الرئيسية» في أعلى روابط التذييل
          </label>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">مجموعات روابط التذييل</p>
              <Button type="button" variant="outline" size="sm" onClick={handleRestoreQuickLinks}>
                <RotateCcw className="h-3.5 w-3.5" />
                استعادة الافتراضي
              </Button>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              اختر مجموعات القائمة الرئيسية — كل مجموعة تعرض روابطها الفرعية في التذييل
            </p>
            <div className="flex flex-col gap-2">
              {navItems
                .filter((item) => item.enabled)
                .sort((a, b) => a.order - b.order)
                .map((item) => {
                  const hasMenu = navHasDropdown(item, getDefaultPrograms(), defaultNavLabels);
                  const checked = data.quickLinkIds.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-3 py-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLink(item.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-brand-green"
                      />
                      <span className="min-w-0">
                        <span className="font-medium">{pickAdminLabel(item.label)}</span>
                        <span className="ms-2 text-xs text-muted-foreground" dir="ltr">
                          {item.href}
                        </span>
                        {hasMenu && (
                          <span className="mt-1 block text-xs text-brand-green">
                            قائمة منسدلة — تُعرض روابطها الفرعية في التذييل
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
            </div>
            {groupedPreview.length > 0 && (
              <div className="mt-4 rounded-xl bg-border-subtle/50 p-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">معاينة التجميع</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {groupedPreview.map((group) => (
                    <div key={group.id}>
                      <p className="text-xs font-bold">{pickAdminLabel(group.title)}</p>
                      <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                        {group.links.map((link) => (
                          <li key={link.id}>· {pickAdminLabel(link.label)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
