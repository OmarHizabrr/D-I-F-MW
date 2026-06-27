"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Ban, UserCheck } from "lucide-react";
import { useAuth, getUserMeta } from "@/context/AuthContext";
import {
  listAllUsers,
  createAdminAccount,
  setUserBanned,
  setUserActive,
} from "@/services/userService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { ConfirmDialog, ConfirmIcons } from "@/components/admin/ConfirmDialog";
import { AdminPageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { AppUser } from "@/types/user";
import { isAdminRole } from "@/types/user";

function sortUsers(list: AppUser[]) {
  return [...list].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

type BanConfirm = { user: AppUser; action: "ban" | "unban" };

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [ready, setReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [banConfirm, setBanConfirm] = useState<BanConfirm | null>(null);
  const [banLoading, setBanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const patchUser = useCallback((uid: string, patch: Partial<AppUser>) => {
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, ...patch } : u)));
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const list = await listAllUsers();
        if (!cancelled) {
          setUsers(sortUsers(list));
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateAdmin() {
    if (!user || !email.trim() || password.length < 6) {
      setError("أدخل بريداً صالحاً وكلمة مرور (6 أحرف على الأقل)");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createAdminAccount(email.trim(), password, getUserMeta(user));
      setMessage(`تم إنشاء حساب المدير ${email}`);
      setDialogOpen(false);
      setEmail("");
      setPassword("");
      const list = await listAllUsers();
      setUsers(sortUsers(list));
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إنشاء الحساب");
    } finally {
      setSaving(false);
    }
  }

  async function handleBanConfirm() {
    if (!banConfirm || !user) return;
    const { user: target, action } = banConfirm;
    const nextBanned = action === "ban";

    setBanLoading(true);
    patchUser(target.uid, { banned: nextBanned });

    try {
      await setUserBanned(target.uid, nextBanned, getUserMeta(user));
      setBanConfirm(null);
      setMessage(nextBanned ? "تم حظر المستخدم بنجاح" : "تم رفع الحظر عن المستخدم");
    } catch {
      patchUser(target.uid, { banned: target.banned });
    } finally {
      setBanLoading(false);
    }
  }

  async function toggleActive(target: AppUser) {
    if (!user) return;
    setActionId(target.uid);
    const nextActive = !target.active;
    patchUser(target.uid, { active: nextActive });

    try {
      await setUserActive(target.uid, nextActive, getUserMeta(user));
    } catch {
      patchUser(target.uid, { active: target.active });
    } finally {
      setActionId(null);
    }
  }

  if (!ready) {
    return <AdminPageSkeleton />;
  }

  const banDialog = banConfirm
    ? banConfirm.action === "ban"
      ? {
          title: "حظر المستخدم",
          message: `هل تريد حظر «${banConfirm.user.displayName || banConfirm.user.email}» من مشاركة الآراء على الموقع؟`,
          description: "لن يتمكن من إرسال آراء جديدة، ويمكنك رفع الحظر لاحقاً.",
          confirmLabel: "تأكيد الحظر",
          loadingText: "جاري الحظر...",
          variant: "warning" as const,
          icon: ConfirmIcons.ban,
        }
      : {
          title: "رفع الحظر",
          message: `هل تريد رفع الحظر عن «${banConfirm.user.displayName || banConfirm.user.email}» والسماح له بالمشاركة مجدداً؟`,
          confirmLabel: "رفع الحظر",
          loadingText: "جاري رفع الحظر...",
          variant: "success" as const,
          icon: ConfirmIcons.unban,
        }
    : null;

  return (
    <div>
      <AdminPageHeader
        title="إدارة المستخدمين"
        description="إضافة مديرين جدد، حظر المستخدمين، وإدارة الحسابات"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            إضافة مدير
          </Button>
        }
      />

      {message && (
        <p className="mb-4 animate-in fade-in rounded-xl bg-brand-green/10 px-4 py-3 text-sm text-brand-green-dark dark:text-brand-green">
          {message}
        </p>
      )}

      <AdminFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setError(null);
        }}
        title="مدير جديد"
        description="سيُنشأ حساب Firebase Authentication بالبريد وكلمة المرور"
        onSave={handleCreateAdmin}
        saving={saving}
        saveLabel="إنشاء الحساب"
      >
        <Input
          label="البريد الإلكتروني"
          type="email"
          dir="ltr"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="كلمة المرور"
          type="password"
          dir="ltr"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="6 أحرف على الأقل"
        />
        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
      </AdminFormDialog>

      {banDialog && (
        <ConfirmDialog
          open={!!banConfirm}
          onClose={() => !banLoading && setBanConfirm(null)}
          onConfirm={handleBanConfirm}
          loading={banLoading}
          title={banDialog.title}
          message={banDialog.message}
          description={banDialog.description}
          confirmLabel={banDialog.confirmLabel}
          loadingText={banDialog.loadingText}
          variant={banDialog.variant}
          icon={banDialog.icon}
        />
      )}

      <div className="space-y-3">
        {users.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-muted-foreground">لا يوجد مستخدمون بعد</p>
          </Card>
        ) : (
          users.map((u) => (
            <Card key={u.uid} hover={false} padding="md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar name={u.displayName || u.email} photoURL={u.photoURL} size="md" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{u.displayName || "—"}</p>
                    <p className="truncate text-sm text-muted-foreground" dir="ltr">
                      {u.email}
                    </p>
                    {u.phone && (
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {u.phone}
                      </p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <Badge variant={isAdminRole(u.role) ? "success" : "default"}>
                        {u.role === "superadmin"
                          ? "مدير عام"
                          : u.role === "admin"
                            ? "مدير"
                            : "عضو"}
                      </Badge>
                      {u.banned && (
                        <Badge className="bg-destructive/10 text-destructive">محظور</Badge>
                      )}
                      {!u.active && <Badge>معطّل</Badge>}
                      {!u.profileComplete && isAdminRole(u.role) && (
                        <Badge>ملف غير مكتمل</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {!isAdminRole(u.role) && (
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      variant={u.banned ? "secondary" : "destructive"}
                      size="sm"
                      onClick={() =>
                        setBanConfirm({
                          user: u,
                          action: u.banned ? "unban" : "ban",
                        })
                      }
                    >
                      {u.banned ? (
                        <>
                          <UserCheck className="h-4 w-4" />
                          رفع الحظر
                        </>
                      ) : (
                        <>
                          <Ban className="h-4 w-4" />
                          حظر
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      loading={actionId === u.uid}
                      loadingText="..."
                      onClick={() => toggleActive(u)}
                    >
                      <UserCheck className="h-4 w-4" />
                      {u.active ? "تعطيل" : "تفعيل"}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
