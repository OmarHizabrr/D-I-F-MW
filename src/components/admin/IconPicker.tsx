"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import type { IconOption } from "@/lib/admin/icon-options";
import { cn } from "@/lib/utils";

type IconPickerProps = {
  label?: string;
  value: string;
  onChange: (key: string) => void;
  options: IconOption[];
};

export function IconPicker({ label = "الأيقونة", value, onChange, options }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.key === value) || options[0];
  const SelectedIcon = selected?.icon;

  function pick(key: string) {
    onChange(key);
    setOpen(false);
  }

  return (
    <>
      <div className="flex w-full flex-col gap-1.5">
        {label && <span className="text-sm font-medium text-foreground">{label}</span>}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 w-full items-center gap-3 rounded-2xl border border-border bg-input-bg px-4 text-sm transition-colors hover:border-brand-green/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
        >
          {SelectedIcon && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-dark dark:text-brand-green">
              <SelectedIcon className="h-4 w-4" />
            </span>
          )}
          <span className="flex-1 text-start text-foreground">{selected?.label || "اختر أيقونة"}</span>
          <span className="text-xs text-muted-foreground">تغيير</span>
        </button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="اختر أيقونة"
        description="اضغط على الأيقونة المناسبة"
        size="md"
      >
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {options.map(({ key, label: optLabel, icon: Icon }) => {
            const active = key === value;
            return (
              <button
                key={key}
                type="button"
                onClick={() => pick(key)}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-colors",
                  active
                    ? "border-brand-green bg-brand-green/10"
                    : "border-border-subtle hover:border-brand-green/40 hover:bg-brand-green/5"
                )}
              >
                {active && (
                  <span className="absolute end-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-white">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-dark dark:text-brand-green">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-medium leading-tight text-foreground">{optLabel}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            إغلاق
          </Button>
        </div>
      </Dialog>
    </>
  );
}
