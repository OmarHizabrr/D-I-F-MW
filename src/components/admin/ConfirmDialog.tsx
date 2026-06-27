"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Ban, Trash2, UserCheck, EyeOff } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ConfirmDialogVariant = "danger" | "warning" | "success" | "default";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  loadingText?: string;
  variant?: ConfirmDialogVariant;
  icon?: ReactNode;
};

const variantConfig: Record<
  ConfirmDialogVariant,
  { icon: ReactNode; iconClass: string; buttonVariant: "destructive" | "brown" | "primary" }
> = {
  danger: {
    icon: <Trash2 className="h-6 w-6" />,
    iconClass: "bg-destructive/10 text-destructive",
    buttonVariant: "destructive",
  },
  warning: {
    icon: <Ban className="h-6 w-6" />,
    iconClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    buttonVariant: "destructive",
  },
  success: {
    icon: <UserCheck className="h-6 w-6" />,
    iconClass: "bg-brand-green/10 text-brand-green-dark dark:text-brand-green",
    buttonVariant: "brown",
  },
  default: {
    icon: <AlertTriangle className="h-6 w-6" />,
    iconClass: "bg-brand-green/10 text-brand-green-dark dark:text-brand-green",
    buttonVariant: "primary",
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "تأكيد الحذف",
  message,
  description,
  confirmLabel = "حذف",
  cancelLabel = "إلغاء",
  loading = false,
  loadingText,
  variant = "default",
  icon,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const displayIcon = icon ?? config.icon;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading} className="w-full sm:w-auto">
            {cancelLabel}
          </Button>
          <Button
            variant={config.buttonVariant}
            loading={loading}
            loadingText={loadingText ?? "جاري التنفيذ..."}
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center sm:items-start sm:text-start">
        <div
          className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
            config.iconClass
          )}
        >
          {displayIcon}
        </div>
        <p className="text-sm leading-relaxed text-foreground">{message}</p>
      </div>
    </Dialog>
  );
}

/** أيقونات جاهزة للاستخدام في ConfirmDialog */
export const ConfirmIcons = {
  ban: <Ban className="h-6 w-6" />,
  unban: <UserCheck className="h-6 w-6" />,
  hide: <EyeOff className="h-6 w-6" />,
  delete: <Trash2 className="h-6 w-6" />,
};
