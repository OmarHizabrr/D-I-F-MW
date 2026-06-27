"use client";

import type { ReactNode } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

type AdminFormDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onSave: () => void;
  saving?: boolean;
  saveLabel?: string;
  size?: "sm" | "md" | "lg" | "full";
  children: ReactNode;
};

export function AdminFormDialog({
  open,
  onClose,
  title,
  description,
  onSave,
  saving = false,
  saveLabel = "حفظ",
  size = "lg",
  children,
}: AdminFormDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving} className="w-full sm:w-auto">
            إلغاء
          </Button>
          <Button
            loading={saving}
            loadingText="جاري الحفظ..."
            onClick={onSave}
            className="w-full sm:w-auto"
          >
            {saveLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">{children}</div>
    </Dialog>
  );
}
