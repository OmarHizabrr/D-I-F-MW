"use client";

import { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth } from "@/context/AuthContext";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import { restoreDefaultNavItems } from "@/services/navService";
import { navHasDropdown } from "@/lib/nav-utils";
import { getDefaultPrograms } from "@/data/default-content";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminItemList } from "@/components/admin/AdminItemList";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { pickAdminLabel } from "@/lib/admin/pickAdminLabel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { NavItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

function newItem(order: number): NavItem {
  return { id: "", label: emptyLocalized(), href: "#", order, enabled: true };
}

const dropdownNavIds = new Set(["about", "impact", "newsEvents", "joinUs", "projects"]);

const defaultNavLabels = {
  aboutOverview: { ar: "نبذة عن المؤسسة", en: "About", ny: "Za Fundo" },
  team: { ar: "فريق العمل", en: "Our Team", ny: "Gulu Lathu" },
  faq: { ar: "الأسئلة الشائعة", en: "FAQ", ny: "Mafunso" },
  ourWork: { ar: "أعمالنا", en: "Our Work", ny: "Ntchito" },
  allProjects: { ar: "جميع المشاريع", en: "All Projects", ny: "Mapulojekiti" },
  successStories: { ar: "قصص النجاح", en: "Success Stories", ny: "Nkhani" },
  stories: { ar: "قصصنا", en: "Our Stories", ny: "Nkhani" },
  news: { ar: "الأخبار", en: "News", ny: "Nkhani" },
  events: { ar: "الفعاليات", en: "Events", ny: "Zochitika" },
  media: { ar: "مكتبة الوسائط", en: "Media", ny: "Media" },
  volunteer: { ar: "التطوع", en: "Volunteer", ny: "Kuthandiza" },
  contact: { ar: "تواصل معنا", en: "Contact", ny: "Contact" },
  shareStory: { ar: "شارك قصتك", en: "Share Story", ny: "Gawani" },
  resources: { ar: "الموارد", en: "Resources", ny: "Zothandizira" },
};

export default function AdminNavigationPage() {
  const { user } = useAuth();
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const {
    items,
    loading,
    editing,
    setEditing,
    saving,
    deletingId,
    deleteTarget,
    setDeleteTarget,
    handleSave,
    handleDeleteConfirm,
    loadItems,
  } = useAdminCrud<NavItem>({
    getCollection: () => api.getNavItemsCollection(),
    getDocRef: (id) => api.getNavItemDoc(id),
    newIdPrefix: "nav",
    user: user ? { uid: user.uid, displayName: user.email ?? undefined } : null,
  });

  async function handleRestoreDefaults() {
    setRestoring(true);
    setRestoreMessage(null);
    try {
      await restoreDefaultNavItems({
        uid: user?.uid,
        displayName: user?.email ?? undefined,
      });
      await loadItems();
      setRestoreMessage("تم استعادة روابط القائمة الافتراضية");
    } catch {
      setRestoreMessage("تعذّر استعادة الروابط");
    } finally {
      setRestoring(false);
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
        title="القائمة الرئيسية"
        description="إدارة روابط التنقل في الموقع"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" loading={restoring} onClick={handleRestoreDefaults}>
              <RotateCcw className="h-4 w-4" />
              استعادة الافتراضي
            </Button>
            <Button onClick={() => setEditing(newItem(items.length + 1))}>
              <Plus className="h-4 w-4" />
              إضافة رابط
            </Button>
          </div>
        }
      />

      {restoreMessage && (
        <p className="mb-4 rounded-xl bg-brand-green/10 px-4 py-3 text-sm text-brand-green-dark">
          {restoreMessage}
        </p>
      )}

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل رابط" : "رابط جديد"}
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
            <LocalizedInput
              label="التسمية"
              value={editing.label}
              onChange={(label) => setEditing({ ...editing, label })}
            />
            <Input
              label="الرابط"
              dir="ltr"
              value={editing.href}
              onChange={(e) => setEditing({ ...editing, href: e.target.value })}
              hint="مثال: /about أو /projects أو /contact"
            />
            <Input
              label="الترتيب"
              type="number"
              value={editing.order}
              onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.enabled}
                onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-border text-brand-green"
              />
              مفعّل
            </label>
          </>
        )}
      </AdminFormDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={!!deletingId}
        message={`هل أنت متأكد من حذف «${pickAdminLabel(deleteTarget?.label)}»؟`}
      />

      <AdminItemList
        items={items}
        emptyMessage="لا توجد روابط بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => pickAdminLabel(item.label)}
        renderSubtitle={(item) => {
          const hasMenu =
            dropdownNavIds.has(item.id) ||
            navHasDropdown(item, getDefaultPrograms(), defaultNavLabels);
          const menuHint = hasMenu ? " · قائمة منسدلة" : "";
          return `${item.href} · ترتيب ${item.order}${menuHint}`;
        }}
      />
    </div>
  );
}
