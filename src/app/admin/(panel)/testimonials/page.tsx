"use client";

import { useEffect, useMemo, useState } from "react";
import { query, orderBy } from "firebase/firestore";
import { Plus, Pencil, Trash2, Check, Ban, UserCheck, Eye, EyeOff } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { useAuth, getUserMeta } from "@/context/AuthContext";
import {
  approveTestimonial,
  rejectTestimonial,
  banTestimonialUser,
  unbanTestimonialUser,
  hideTestimonialFromSite,
  showTestimonialOnSite,
  testimonialStatusLabel,
  isTestimonialHidden,
} from "@/services/testimonialService";
import { listAllUsers } from "@/services/userService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { ConfirmDialog, ConfirmIcons } from "@/components/admin/ConfirmDialog";
import { AdminPageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { YouTubeField } from "@/components/admin/YouTubeField";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { pickAdminLabel } from "@/lib/admin/pickAdminLabel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { TestimonialItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

type FilterTab = "all" | "pending" | "published" | "hidden";

type ConfirmAction =
  | { type: "delete"; item: TestimonialItem }
  | { type: "ban"; item: TestimonialItem }
  | { type: "unban"; item: TestimonialItem };

function newItem(order: number): TestimonialItem {
  return {
    id: "",
    name: emptyLocalized(),
    role: emptyLocalized(),
    quote: emptyLocalized(),
    imageUrl: "",
    youtubeUrl: "",
    enabled: true,
    order,
    source: "admin",
    status: "approved",
  };
}

export default function AdminTestimonialsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<FilterTab>("all");
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void listAllUsers().then((users) => {
      if (!cancelled) {
        setBannedUsers(new Set(users.filter((u) => u.banned).map((u) => u.uid)));
      }
    });

    const q = query(api.getTestimonialsCollection(), orderBy("order", "asc"));
    const unsub = api.subscribeQuerySnapshot(q, (snap) => {
      if (cancelled) return;
      setItems(snap.docs.map((d) => api.docToData<TestimonialItem>(d)));
      setReady(true);
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (tab === "pending") return item.status === "pending";
      if (tab === "published") return item.enabled && item.status !== "pending";
      if (tab === "hidden") return isTestimonialHidden(item);
      return true;
    });
  }, [items, tab]);

  const pendingCount = items.filter((i) => i.status === "pending").length;
  const hiddenCount = items.filter((i) => isTestimonialHidden(i)).length;

  function patchItem(id: string, patch: Partial<TestimonialItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function setUserBannedState(userId: string, banned: boolean) {
    setBannedUsers((prev) => {
      const next = new Set(prev);
      if (banned) next.add(userId);
      else next.delete(userId);
      return next;
    });
  }

  async function handleSave() {
    if (!editing || !user) return;
    setSaving(true);
    const id = editing.id || api.getNewId("testimonials");
    const payload: TestimonialItem = {
      ...editing,
      id,
      source: editing.source || "admin",
      status: editing.status || "approved",
    };

    if (!editing.id) {
      setItems((prev) => [...prev, payload]);
    } else {
      patchItem(id, payload);
    }

    try {
      await api.setData({
        docRef: api.getTestimonialDoc(id),
        data: payload,
        userData: getUserMeta(user),
      });
      setEditing(null);
    } catch {
      setItems((prev) =>
        editing.id ? prev.map((i) => (i.id === id ? editing : i)) : prev.filter((i) => i.id !== id)
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmAction() {
    if (!confirmAction || !user) return;
    setConfirmLoading(true);

    try {
      if (confirmAction.type === "delete") {
        const { item } = confirmAction;
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        await rejectTestimonial(item.id, getUserMeta(user));
      }

      if (confirmAction.type === "ban") {
        const { item } = confirmAction;
        if (!item.userId) return;
        setUserBannedState(item.userId, true);
        await banTestimonialUser(item.userId, getUserMeta(user));
      }

      if (confirmAction.type === "unban") {
        const { item } = confirmAction;
        if (!item.userId) return;
        setUserBannedState(item.userId, false);
        await unbanTestimonialUser(item.userId, getUserMeta(user));
      }

      setConfirmAction(null);
    } catch {
      if (confirmAction.type === "ban" && confirmAction.item.userId) {
        setUserBannedState(confirmAction.item.userId, false);
      }
      if (confirmAction.type === "unban" && confirmAction.item.userId) {
        setUserBannedState(confirmAction.item.userId, true);
      }
      if (confirmAction.type === "delete") {
        setItems((prev) => [...prev, confirmAction.item]);
      }
    } finally {
      setConfirmLoading(false);
    }
  }

  async function handleApprove(item: TestimonialItem) {
    if (!user) return;
    setActionId(item.id);
    patchItem(item.id, { status: "approved", enabled: true });
    try {
      await approveTestimonial(item.id, getUserMeta(user));
    } catch {
      patchItem(item.id, { status: item.status, enabled: item.enabled });
    } finally {
      setActionId(null);
    }
  }

  async function handleToggleVisibility(item: TestimonialItem) {
    if (!user) return;
    setActionId(item.id);
    const hiding = item.enabled;
    patchItem(item.id, { enabled: !hiding });
    try {
      if (hiding) {
        await hideTestimonialFromSite(item.id, getUserMeta(user));
      } else {
        await showTestimonialOnSite(item.id, getUserMeta(user));
      }
    } catch {
      patchItem(item.id, { enabled: item.enabled });
    } finally {
      setActionId(null);
    }
  }

  if (!ready) {
    return <AdminPageSkeleton />;
  }

  const confirmConfig = (() => {
    if (!confirmAction) return null;
    const name = pickAdminLabel(confirmAction.item.name);

    if (confirmAction.type === "delete") {
      return {
        title: "تأكيد الحذف",
        message: `هل أنت متأكد من حذف شهادة «${name}»؟ لا يمكن التراجع عن هذا الإجراء.`,
        confirmLabel: "حذف",
        loadingText: "جاري الحذف...",
        variant: "danger" as const,
        icon: ConfirmIcons.delete,
      };
    }

    if (confirmAction.type === "ban") {
      return {
        title: "حظر المستخدم",
        message: `سيتم حظر «${name}» من مشاركة أي آراء مستقبلية على الموقع. هل تريد المتابعة؟`,
        description: "يبقى الرأي الحالي في لوحة التحكم ويمكنك إدارته.",
        confirmLabel: "تأكيد الحظر",
        loadingText: "جاري الحظر...",
        variant: "warning" as const,
        icon: ConfirmIcons.ban,
      };
    }

    return {
      title: "رفع الحظر",
      message: `هل تريد رفع الحظر عن «${name}» والسماح له بمشاركة آراء جديدة؟`,
      confirmLabel: "رفع الحظر",
      loadingText: "جاري رفع الحظر...",
      variant: "success" as const,
      icon: ConfirmIcons.unban,
    };
  })();

  return (
    <div>
      <AdminPageHeader
        title="آراء المستفيدين"
        description="مراجعة آراء الزوار، الموافقة، الإخفاء، الحذف، وحظر المستخدمين"
        actions={
          <Button onClick={() => setEditing(newItem(items.length + 1))}>
            <Plus className="h-4 w-4" />
            إضافة شهادة
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "الكل"],
            ["pending", `بانتظار الموافقة${pendingCount ? ` (${pendingCount})` : ""}`],
            ["published", "منشور"],
            ["hidden", `مخفي${hiddenCount ? ` (${hiddenCount})` : ""}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              tab === key
                ? "bg-brand-green text-white"
                : "bg-border-subtle text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <AdminFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "تعديل شهادة" : "شهادة جديدة"}
        onSave={handleSave}
        saving={saving}
      >
        {editing && (
          <>
            <LocalizedInput
              label="الاسم"
              value={editing.name}
              onChange={(name) => setEditing({ ...editing, name })}
            />
            <LocalizedInput
              label="الصفة"
              value={editing.role}
              onChange={(role) => setEditing({ ...editing, role })}
            />
            <LocalizedInput
              label="الاقتباس"
              value={editing.quote}
              onChange={(quote) => setEditing({ ...editing, quote })}
              multiline
            />
            <FileUploadField
              label="الصورة"
              folder="testimonials"
              value={editing.imageUrl}
              onChange={(imageUrl) => setEditing({ ...editing, imageUrl })}
            />
            <YouTubeField
              value={editing.youtubeUrl}
              onChange={(youtubeUrl) => setEditing({ ...editing, youtubeUrl })}
            />
          </>
        )}
      </AdminFormDialog>

      {confirmConfig && (
        <ConfirmDialog
          open={!!confirmAction}
          onClose={() => !confirmLoading && setConfirmAction(null)}
          onConfirm={handleConfirmAction}
          loading={confirmLoading}
          title={confirmConfig.title}
          message={confirmConfig.message}
          description={confirmConfig.description}
          confirmLabel={confirmConfig.confirmLabel}
          loadingText={confirmConfig.loadingText}
          variant={confirmConfig.variant}
          icon={confirmConfig.icon}
        />
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-muted-foreground">لا توجد شهادات في هذا القسم</p>
          </Card>
        ) : (
          filtered.map((item) => {
            const isBanned = item.userId ? bannedUsers.has(item.userId) : false;
            const canToggleVisibility = item.status === "approved" || item.status === undefined;

            return (
              <Card key={item.id} hover={false} padding="md">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <UserAvatar
                      name={pickAdminLabel(item.name)}
                      photoURL={item.imageUrl}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{pickAdminLabel(item.name)}</p>
                        <Badge
                          variant={
                            item.status === "pending"
                              ? "default"
                              : isTestimonialHidden(item)
                                ? "brown"
                                : item.enabled
                                  ? "success"
                                  : "default"
                          }
                        >
                          {testimonialStatusLabel(item)}
                        </Badge>
                        {item.source === "public" && <Badge>من الزوار</Badge>}
                        {isBanned && (
                          <Badge className="bg-destructive/10 text-destructive">محظور</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{pickAdminLabel(item.role)}</p>
                      <p className="mt-2 line-clamp-3 text-sm italic">
                        &ldquo;{pickAdminLabel(item.quote)}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-1.5">
                    {item.status === "pending" && (
                      <Button
                        size="sm"
                        loading={actionId === item.id}
                        loadingText="..."
                        onClick={() => handleApprove(item)}
                      >
                        <Check className="h-4 w-4" />
                        موافقة
                      </Button>
                    )}

                    {canToggleVisibility && (
                      <Button
                        variant="outline"
                        size="sm"
                        loading={actionId === item.id}
                        loadingText="..."
                        onClick={() => handleToggleVisibility(item)}
                      >
                        {item.enabled ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            إخفاء
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            إظهار
                          </>
                        )}
                      </Button>
                    )}

                    {item.source === "public" && item.userId && (
                      <Button
                        variant={isBanned ? "secondary" : "destructive"}
                        size="sm"
                        onClick={() =>
                          setConfirmAction(
                            isBanned
                              ? { type: "unban", item }
                              : { type: "ban", item }
                          )
                        }
                      >
                        {isBanned ? (
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
                    )}

                    <Button variant="secondary" size="icon" onClick={() => setEditing(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setConfirmAction({ type: "delete", item })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
