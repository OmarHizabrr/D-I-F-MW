"use client";

import { useCallback, useEffect, useState } from "react";
import { listAllNotifications, markNotificationRead } from "@/services/notificationService";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { AppNotification } from "@/types/project-management";

export default function ManagementNotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    setItems(await listAllNotifications());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    await loadItems();
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
        title="الإشعارات"
        description="سجل إشعارات النظام — بدء التنفيذ، رفع تقارير، إضافة أعضاء، وغيرها"
      />
      <div className="space-y-3">
        {items.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-muted-foreground">لا توجد إشعارات</p>
          </Card>
        ) : (
          items.map((n) => (
            <Card key={n.id} padding="md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`font-medium ${!n.read ? "text-brand-green-dark dark:text-brand-green" : ""}`}>
                    {n.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {n.type} · {n.createdAt?.slice(0, 16)}
                  </p>
                </div>
                {!n.read && (
                  <Button size="sm" variant="outline" onClick={() => handleMarkRead(n.id)}>
                    مقروء
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
