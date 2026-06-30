"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Copy, QrCode } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import FirestoreApi from "@/services/firestoreApi";
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
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminItemList } from "@/components/admin/AdminItemList";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { Donor, DonorKind } from "@/types/project-management";
import type { AppUser } from "@/types/user";

const api = FirestoreApi.Api;

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
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Donor | ReturnType<typeof newDonor>) | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Donor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState<Donor | null>(null);

  const loadItems = useCallback(async () => {
    const [donors, usersSnap] = await Promise.all([
      listDonors(),
      api.getDocuments(api.getUsersCollection()),
    ]);
    setItems(donors);
    setAllUsers(usersSnap.map((d) => api.docToData<AppUser>(d)));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

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
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteDonor(deleteTarget.id);
      setDeleteTarget(null);
      await loadItems();
    } finally {
      setDeletingId(null);
    }
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
        description="إدارة حسابات المتبرعين وبوابة المتابعة الخاصة"
        actions={
          <Button onClick={() => setEditing(newDonor())}>
            <Plus className="h-4 w-4" />
            متبرع جديد
          </Button>
        }
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
              value={editing.fullName}
              onChange={(e) => setEditing({ ...editing, fullName: e.target.value })}
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
              value={editing.email}
              onChange={(e) => setEditing({ ...editing, email: e.target.value })}
            />
            <Input
              label="الهاتف"
              dir="ltr"
              value={editing.phone}
              onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
            />
            <Input
              label="المؤسسة (اختياري)"
              value={editing.organization ?? ""}
              onChange={(e) => setEditing({ ...editing, organization: e.target.value })}
            />
            <Input
              label="الدولة"
              value={editing.country ?? ""}
              onChange={(e) => setEditing({ ...editing, country: e.target.value })}
            />
            <Select
              label="حساب مستخدم مرتبط (لـ MyGroups)"
              value={editing.linkedUserId ?? ""}
              onChange={(linkedUserId) => setEditing({ ...editing, linkedUserId })}
              options={[
                { value: "", label: "— بدون ربط —" },
                ...allUsers.map((u) => ({
                  value: u.uid,
                  label: u.displayName || u.email,
                })),
              ]}
            />
            <Input
              label="اسم مستخدم البوابة"
              dir="ltr"
              value={editing.portalUsername ?? ""}
              onChange={(e) => setEditing({ ...editing, portalUsername: e.target.value })}
              hint="للدخول عبر /portal"
            />
            <div className="flex items-end gap-2">
              <Input
                label="الرمز السري"
                dir="ltr"
                value={editing.portalPin ?? ""}
                onChange={(e) => setEditing({ ...editing, portalPin: e.target.value })}
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
            {item.portalEnabled && (
              <>
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
