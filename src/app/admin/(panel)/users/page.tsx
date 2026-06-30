"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Ban, UserCheck, Pencil, KeyRound, Trash2, Shield } from "lucide-react";
import { useAuth, getUserMeta } from "@/context/AuthContext";
import {
  listAllUsers,
  createAdminAccount,
  setUserBanned,
  setUserActive,
} from "@/services/userService";
import {
  superAdminUpdateUser,
  superAdminDeleteUser,
  superAdminChangePassword,
  userToEditForm,
} from "@/services/adminUserApi";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { ConfirmDialog, ConfirmIcons } from "@/components/admin/ConfirmDialog";
import { AdminPageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { AppUser, UserRole, UserDepartment } from "@/types/user";
import { isAdminRole, isSuperAdminRole } from "@/types/user";

function sortUsers(list: AppUser[]) {
  return [...list].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

type BanConfirm = { user: AppUser; action: "ban" | "unban" };
type EditForm = ReturnType<typeof userToEditForm>;
type PasswordTarget = { user: AppUser; label: string } | null;

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "superadmin", label: "مدير عام" },
  { value: "admin", label: "مدير" },
  { value: "member", label: "عضو" },
];

const departmentOptions: { value: UserDepartment | ""; label: string }[] = [
  { value: "", label: "—" },
  { value: "management", label: "الإدارة" },
  { value: "engineering", label: "الهندسة" },
  { value: "finance", label: "المالية" },
  { value: "media", label: "الإعلام" },
  { value: "supervision", label: "الإشراف" },
  { value: "field", label: "ميداني" },
  { value: "other", label: "أخرى" },
];

export default function AdminUsersPage() {
  const { user, userProfile } = useAuth();
  const isSuperAdmin = isSuperAdminRole(userProfile?.role);

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

  const [editTarget, setEditTarget] = useState<AppUser | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const [passwordTarget, setPasswordTarget] = useState<PasswordTarget>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const reloadUsers = useCallback(async () => {
    const list = await listAllUsers();
    setUsers(sortUsers(list));
  }, []);

  const patchUser = useCallback((uid: string, patch: Partial<AppUser>) => {
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, ...patch } : u)));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listAllUsers();
        if (!cancelled) setUsers(sortUsers(list));
      } finally {
        if (!cancelled) setReady(true);
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
      await reloadUsers();
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
      if (isSuperAdmin) {
        await superAdminUpdateUser(target.uid, { banned: nextBanned });
      } else {
        await setUserBanned(target.uid, nextBanned, getUserMeta(user));
      }
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
      if (isSuperAdmin) {
        await superAdminUpdateUser(target.uid, { active: nextActive });
      } else {
        await setUserActive(target.uid, nextActive, getUserMeta(user));
      }
    } catch {
      patchUser(target.uid, { active: target.active });
    } finally {
      setActionId(null);
    }
  }

  function openEdit(u: AppUser) {
    setEditTarget(u);
    setEditForm(userToEditForm(u));
    setError(null);
  }

  async function handleEditSave() {
    if (!editTarget || !editForm) return;
    setEditSaving(true);
    setError(null);
    try {
      await superAdminUpdateUser(editTarget.uid, {
        displayName: editForm.displayName,
        phone: editForm.phone,
        email: editForm.email,
        role: editForm.role,
        active: editForm.active,
        banned: editForm.banned,
        jobTitle: editForm.jobTitle || undefined,
        department: (editForm.department || undefined) as UserDepartment | undefined,
      });
      setMessage("تم تحديث بيانات المستخدم");
      setEditTarget(null);
      await reloadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل التحديث");
    } finally {
      setEditSaving(false);
    }
  }

  async function handlePasswordSave() {
    if (!passwordTarget) return;
    if (newPassword.length < 6) {
      setError("كلمة المرور 6 أحرف على الأقل");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setPasswordSaving(true);
    setError(null);
    try {
      await superAdminChangePassword(passwordTarget.user.uid, newPassword);
      setMessage(
        passwordTarget.user.uid === user?.uid
          ? "تم تغيير كلمة مرورك بنجاح"
          : `تم تغيير كلمة مرور ${passwordTarget.label}`
      );
      setPasswordTarget(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تغيير كلمة المرور");
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await superAdminDeleteUser(deleteTarget.uid);
      setMessage(`تم حذف حساب «${deleteTarget.displayName || deleteTarget.email}»`);
      setDeleteTarget(null);
      await reloadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الحذف");
    } finally {
      setDeleteLoading(false);
    }
  }

  if (!ready) {
    return <AdminPageSkeleton />;
  }

  const banDialog = banConfirm
    ? banConfirm.action === "ban"
      ? {
          title: "حظر المستخدم",
          message: `هل تريد حظر «${banConfirm.user.displayName || banConfirm.user.email}»؟`,
          description: "لن يتمكن من استخدام الموقع، ويمكنك رفع الحظر لاحقاً.",
          confirmLabel: "تأكيد الحظر",
          loadingText: "جاري الحظر...",
          variant: "warning" as const,
          icon: ConfirmIcons.ban,
        }
      : {
          title: "رفع الحظر",
          message: `هل تريد رفع الحظر عن «${banConfirm.user.displayName || banConfirm.user.email}»؟`,
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
        description={
          isSuperAdmin
            ? "تحكم كامل: إضافة، تعديل، حذف، وتغيير كلمات المرور"
            : "إضافة مديرين جدد، حظر المستخدمين، وإدارة الحسابات"
        }
        actions={
          isSuperAdmin || isAdminRole(userProfile?.role) ? (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              إضافة مدير
            </Button>
          ) : undefined
        }
      />

      {isSuperAdmin && user && (
        <Card padding="md" className="mb-6 border-brand-green/20 bg-brand-green/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-brand-green" />
              <div>
                <p className="font-semibold">حسابك — مدير عام</p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setPasswordTarget({
                  user: users.find((u) => u.uid === user.uid) || {
                    uid: user.uid,
                    email: user.email || "",
                    displayName: user.displayName || "",
                  } as AppUser,
                  label: "حسابك",
                })
              }
            >
              <KeyRound className="h-4 w-4" />
              تغيير كلمة مروري
            </Button>
          </div>
        </Card>
      )}

      {message && (
        <p className="mb-4 animate-in fade-in rounded-xl bg-brand-green/10 px-4 py-3 text-sm text-brand-green-dark dark:text-brand-green">
          {message}
        </p>
      )}

      {error && !dialogOpen && !editTarget && !passwordTarget && (
        <p className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
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
        {error && dialogOpen && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
      </AdminFormDialog>

      <AdminFormDialog
        open={!!editTarget && !!editForm}
        onClose={() => {
          setEditTarget(null);
          setError(null);
        }}
        title={`تعديل: ${editTarget?.displayName || editTarget?.email}`}
        onSave={handleEditSave}
        saving={editSaving}
      >
        {editForm && (
          <>
            <Input
              label="الاسم"
              value={editForm.displayName}
              onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
            />
            <Input
              label="البريد الإلكتروني"
              type="email"
              dir="ltr"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            <Input
              label="الهاتف"
              dir="ltr"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
            <Input
              label="المسمى الوظيفي"
              value={editForm.jobTitle}
              onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
            />
            <Select
              label="القسم"
              value={editForm.department}
              onChange={(v) =>
                setEditForm({ ...editForm, department: v as UserDepartment | "" })
              }
              options={departmentOptions}
            />
            <Select
              label="الدور"
              value={editForm.role}
              onChange={(v) => setEditForm({ ...editForm, role: v as UserRole })}
              options={roleOptions}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editForm.active}
                onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                className="h-4 w-4 rounded border-border text-brand-green"
              />
              الحساب مفعّل
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editForm.banned}
                onChange={(e) => setEditForm({ ...editForm, banned: e.target.checked })}
                className="h-4 w-4 rounded border-border text-brand-green"
              />
              محظور
            </label>
            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}
          </>
        )}
      </AdminFormDialog>

      <AdminFormDialog
        open={!!passwordTarget}
        onClose={() => {
          setPasswordTarget(null);
          setNewPassword("");
          setConfirmPassword("");
          setError(null);
        }}
        title={`تغيير كلمة المرور — ${passwordTarget?.label}`}
        onSave={handlePasswordSave}
        saving={passwordSaving}
        saveLabel="حفظ كلمة المرور"
      >
        <Input
          label="كلمة المرور الجديدة"
          type="password"
          dir="ltr"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          hint="6 أحرف على الأقل"
        />
        <Input
          label="تأكيد كلمة المرور"
          type="password"
          dir="ltr"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && passwordTarget && (
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

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="حذف المستخدم نهائياً"
        message={`هل أنت متأكد من حذف «${deleteTarget?.displayName || deleteTarget?.email}»؟`}
        description="سيُحذف من Firebase Authentication وقاعدة البيانات ولا يمكن التراجع."
        confirmLabel="حذف نهائي"
        loadingText="جاري الحذف..."
        variant="danger"
        icon={ConfirmIcons.ban}
      />

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
                    <p className="font-semibold text-foreground">
                      {u.displayName || "—"}
                      {u.uid === user?.uid && (
                        <span className="ms-2 text-xs font-normal text-brand-green">(أنت)</span>
                      )}
                    </p>
                    <p className="truncate text-sm text-muted-foreground" dir="ltr">
                      {u.email}
                    </p>
                    {u.phone && (
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {u.phone}
                      </p>
                    )}
                    {u.jobTitle && (
                      <p className="text-xs text-muted-foreground">{u.jobTitle}</p>
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

                <div className="flex shrink-0 flex-wrap gap-2">
                  {isSuperAdmin && (
                    <>
                      <Button variant="secondary" size="sm" onClick={() => openEdit(u)}>
                        <Pencil className="h-4 w-4" />
                        تعديل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPasswordTarget({
                            user: u,
                            label: u.displayName || u.email,
                          })
                        }
                      >
                        <KeyRound className="h-4 w-4" />
                        كلمة المرور
                      </Button>
                      {u.uid !== user?.uid && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(u)}
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف
                        </Button>
                      )}
                    </>
                  )}

                  {(!isAdminRole(u.role) || isSuperAdmin) && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
