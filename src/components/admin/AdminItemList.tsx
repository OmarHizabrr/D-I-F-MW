"use client";

import type { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AdminItemListProps<T extends { id: string }> = {
  items: T[];
  emptyMessage?: string;
  deletingId?: string | null;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  renderTitle: (item: T) => ReactNode;
  renderSubtitle?: (item: T) => ReactNode;
};

export function AdminItemList<T extends { id: string }>({
  items,
  emptyMessage = "لا توجد عناصر بعد",
  deletingId,
  onEdit,
  onDelete,
  renderTitle,
  renderSubtitle,
}: AdminItemListProps<T>) {
  if (items.length === 0) {
    return (
      <Card padding="lg">
        <p className="text-center text-muted-foreground">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} hover={false} padding="md">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{renderTitle(item)}</p>
              {renderSubtitle && (
                <p className="mt-0.5 text-sm text-muted-foreground">{renderSubtitle(item)}</p>
              )}
            </div>
            <div className="flex shrink-0 gap-1.5 sm:gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onEdit(item)}
                aria-label="تعديل"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                loading={deletingId === item.id}
                onClick={() => onDelete(item)}
                aria-label="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
