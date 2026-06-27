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
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import type { AppUser } from "@/types/user";
import { isAdminRole } from "@/types/user";

function sortUsers(list: AppUser[]) {
  return list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    const list = await listAllUsers();
    setUsers(sortUsers(list));
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
          setLoading(false);
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
      await refreshUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إنشاء الحساب");
    } finally {
      setSaving(false);
    }
  }

  async function toggleBan(target: AppUser) {
    if (!user) return;
    setActionId(target.uid);
    try {
      await setUserBanned(target.uid, !target.banned, getUserMeta(user));
      await refreshUsers();
    } finally {
      setActionId(null);
    }
  }

  async function toggleActive(target: AppUser) {
    if (!user) return;
    setActionId(target.uid);
    try {
      await setUserActive(target.uid, !target.active, getUserMeta(user));
      await refreshUsers();
    } finally {
      setActionId(null);
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
        <p className="mb-4 rounded-xl bg-brand-green/10 px-4 py-3 text-sm text-brand-green-dark dark:text-brand-green">
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
                      loading={actionId === u.uid}
                      onClick={() => toggleBan(u)}
                    >
                      <Ban className="h-4 w-4" />
                      {u.banned ? "إلغاء الحظر" : "حظر"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleActive(u)}>
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
