"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Copy, QrCode, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  listDonors,
  createDonor,
  updateDonor,
  deleteDonor,
  getDonorPortalUrl,
  getDonorQrPortalUrl,
  generatePortalPin,
} from "@/services/donorService";
import { getQrCodeImageUrl } from "@/services/portalAccessService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { AdminFlowGuide } from "@/components/admin/AdminFlowGuide";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FORM_PLACEHOLDERS, FORM_HINTS } from "@/lib/admin/form-placeholders";
import {
  formatDonorPortalCredentials,
  suggestPortalUsername,
} from "@/lib/portal/donor-credentials";
import { AdminItemList } from "@/components/admin/AdminItemList";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { Donor, DonorKind } from "@/types/project-management";

function newDonor(): Omit<Donor, "id" | "createdAt" | "updatedAt" | "qrCodeToken" | "secureLinkToken"> {
  return {
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    country: "",
    donorKind: "individual",
    status: "active",
    portalEnabled: true,
    portalUsername: "",
    portalPin: generatePortalPin(),
  };
}

const donorKindOptions: { value: DonorKind; label: string }[] = [
  { value: "individual", label: "فرد" },
  { value: "association", label: "جمعية" },
  { value: "organization", label: "مؤسسة" },
  { value: "entity", label: "جهة" },
];

export default function ManagementDonorsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Donor | ReturnType<typeof newDonor>) | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Donor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState<Donor | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setItems(await listDonors());
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const donors = await listDonors();
      if (cancelled) return;
      setItems(donors);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (!editing || !user) return;
    setSaving(true);
    try {
      const meta = { uid: user.uid, displayName: user.email ?? undefined };
      if ("id" in editing && editing.id) {
        await updateDonor(editing.id, editing, meta);
      } else {
        await createDonor(editing as ReturnType<typeof newDonor>, meta);
      }
      setEditing(null);
      await loadItems();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget || !user) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteDonor(deleteTarget.id, { uid: user.uid, displayName: user.email ?? undefined });
      setDeleteTarget(null);
      await loadItems();
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCopyCredentials(donor: Donor) {
    await navigator.clipboard.writeText(formatDonorPortalCredentials(donor));
    setCopiedId(donor.id);
    window.setTimeout(() => setCopiedId(null), 2000);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const editingIsDonor = editing && "id" in editing && !!editing.id;

  return (
    <div>
      <AdminPageHeader
        title="المتبرعون"
        description="سجّل المتبرعين وفعّل بوابة المتابعة"
        previewHref="/portal"
        actions={
          <Button onClick={() => setEditing(newDonor())}>
            <Plus className="h-4 w-4" />
            متبرع جديد
          </Button>
        }
      />

      <AdminFlowGuide
        title="كيف يتابع المتبرع مشاريعه؟"
        steps={[
          "١. أنشئ المتبرع هنا وفعّل «بوابة المتبرع»",
          "٢. حدّد اسم مستخدم ورمزاً سرياً — أو أرسل رابط/QR من القائمة",
          "٣. اربطه بمشروع (رئيسي أو إضافي) من صفحة المشروع",
          "٤. المتبرع يدخل /portal برقم المشروع أو باسم المستخدم والرمز",
        ]}
      />

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editingIsDonor ? "تعديل متبرع" : "متبرع جديد"}
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
            <Input
              label="الاسم / اسم الجهة"
              placeholder={FORM_PLACEHOLDERS.donor.fullName}
              value={editing.fullName}
              onChange={(e) => {
                const fullName = e.target.value;
                const next = { ...editing, fullName };
                if (!editingIsDonor && !editing.portalUsername?.trim()) {
                  next.portalUsername = suggestPortalUsername(fullName);
                }
                setEditing(next);
              }}
            />
            <Select
              label="نوع المتبرع"
              value={editing.donorKind ?? "individual"}
              onChange={(donorKind) =>
                setEditing({ ...editing, donorKind: donorKind as DonorKind })
              }
              options={donorKindOptions}
            />
            <Input
              label="البريد الإلكتروني"
              dir="ltr"
              placeholder={FORM_PLACEHOLDERS.donor.email}
              value={editing.email}
              onChange={(e) => setEditing({ ...editing, email: e.target.value })}
            />
            <Input
              label="الهاتف"
              dir="ltr"
              placeholder={FORM_PLACEHOLDERS.donor.phone}
              value={editing.phone}
              onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
            />
            <Input
              label="المؤسسة (اختياري)"
              placeholder={FORM_PLACEHOLDERS.donor.organization}
              value={editing.organization ?? ""}
              onChange={(e) => setEditing({ ...editing, organization: e.target.value })}
            />
            <Input
              label="الدولة"
              placeholder={FORM_PLACEHOLDERS.donor.country}
              value={editing.country ?? ""}
              onChange={(e) => setEditing({ ...editing, country: e.target.value })}
            />
            <Input
              label="اسم مستخدم البوابة"
              dir="ltr"
              placeholder={FORM_PLACEHOLDERS.donor.portalUsername}
              value={editing.portalUsername ?? ""}
              onChange={(e) => setEditing({ ...editing, portalUsername: e.target.value })}
              hint={FORM_HINTS.donor.portalUsername}
            />
            <div className="flex items-end gap-2">
              <Input
                label="الرمز السري"
                dir="ltr"
                placeholder={FORM_PLACEHOLDERS.donor.portalPin}
                value={editing.portalPin ?? ""}
                onChange={(e) => setEditing({ ...editing, portalPin: e.target.value })}
                hint={FORM_HINTS.donor.portalPin}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing({ ...editing, portalPin: generatePortalPin() })}
              >
                توليد
              </Button>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.portalEnabled}
                onChange={(e) => setEditing({ ...editing, portalEnabled: e.target.checked })}
                className="h-4 w-4 rounded border-border text-brand-green"
              />
              تفعيل بوابة المتبرع
            </label>
          </>
        )}
      </AdminFormDialog>

      <AdminFormDialog
        open={!!showQr}
        onClose={() => setShowQr(null)}
        title="رمز QR للبوابة"
        onSave={() => setShowQr(null)}
        saving={false}
        saveLabel="إغلاق"
      >
        {showQr && (
          <div className="flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getQrCodeImageUrl(getDonorQrPortalUrl(showQr), 220)}
              alt="QR Code"
              width={220}
              height={220}
              className="rounded-xl"
            />
            <p className="text-center text-sm text-muted-foreground">
              امسح الرمز للوصول إلى بوابة {showQr.fullName}
            </p>
          </div>
        )}
      </AdminFormDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={!!deletingId}
        message={`هل أنت متأكد من حذف «${deleteTarget?.fullName}»؟`}
      />

      <p className="mb-3 text-xs text-muted-foreground">{FORM_HINTS.donor.portalLink}</p>

      <AdminItemList
        items={items}
        emptyMessage="لا يوجد متبرعون بعد"
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={setDeleteTarget}
        renderTitle={(item) => item.fullName}
        renderSubtitle={(item) => (
          <span className="flex flex-wrap items-center gap-3">
            <span>{item.email}</span>
            {item.portalUsername && (
              <span dir="ltr" className="text-xs text-muted-foreground">
                @{item.portalUsername}
              </span>
            )}
            {item.portalEnabled && (
              <>
                <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-xs text-brand-green-dark">
                  بوابة مفعّلة
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-brand-green"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleCopyCredentials(item);
                  }}
                >
                  <KeyRound className="h-3 w-3" />
                  {copiedId === item.id ? "تم النسخ" : "نسخ بيانات الدخول"}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-brand-green"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(getDonorPortalUrl(item));
                  }}
                >
                  <Copy className="h-3 w-3" />
                  نسخ الرابط
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-brand-green"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQr(item);
                  }}
                >
                  <QrCode className="h-3 w-3" />
                  QR
                </button>
              </>
            )}
          </span>
        )}
      />
    </div>
  );
}
