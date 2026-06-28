"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, Mail } from "lucide-react";
import FirestoreApi from "@/services/firestoreApi";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import type { DonationIntentRecord } from "@/types/cms";
import { cn } from "@/lib/utils";

const api = FirestoreApi.Api;

export function DonationIntentsPanel() {
  const [items, setItems] = useState<DonationIntentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<DonationIntentRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      const docs = await api.getOrderedDocuments(api.getDonationIntentsCollection());
      setItems(
        docs
          .map((d) => api.docToData<DonationIntentRecord>(d))
          .sort((a, b) => (b.submittedAt || "").localeCompare(a.submittedAt || ""))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteData(api.getDonationIntentDoc(deleteTarget.id));
      setDeleteTarget(null);
      await loadItems();
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {items.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">لا توجد طلبات تبرع بعد</Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-brand-green-dark dark:text-brand-green">
                    {item.currencyCode} {item.amount.toLocaleString()}
                  </p>
                  <p className="font-medium">{item.donorName}</p>
                  <a
                    href={`mailto:${item.donorEmail}`}
                    className="text-sm text-muted-foreground hover:text-brand-green"
                    dir="ltr"
                  >
                    {item.donorEmail}
                  </a>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.submittedAt ? new Date(item.submittedAt).toLocaleString("ar") : "—"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={item.status === "redirected" ? "brown" : "success"}>
                    {item.status === "redirected" ? "توجيه خارجي" : "مسجّل"}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`mailto:${item.donorEmail}`, "_blank")}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(item)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        message="هل أنت متأكد من حذف طلب التبرع هذا؟"
      />
    </>
  );
}
