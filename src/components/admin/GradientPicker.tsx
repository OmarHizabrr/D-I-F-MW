"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import {
  programGradientOptions,
  type GradientOption,
} from "@/lib/admin/gradient-options";
import { cn } from "@/lib/utils";

type GradientPickerProps = {
  label?: string;
  value: string;
  onChange: (classes: string) => void;
  options?: GradientOption[];
};

export function GradientPicker({
  label = "لون الخلفية",
  value,
  onChange,
  options = programGradientOptions,
}: GradientPickerProps) {
  const [open, setOpen] = useState(false);
  const selected =
    options.find((g) => g.classes === value) ||
    options[0];

  function pick(classes: string) {
    onChange(classes);
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
          <span
            className="h-8 w-12 shrink-0 rounded-xl border border-border-subtle"
            style={{
              background: `linear-gradient(135deg, ${selected.previewFrom}, ${selected.previewTo})`,
            }}
          />
          <span className="flex-1 text-start text-foreground">{selected.label}</span>
          <span className="text-xs text-muted-foreground">تغيير</span>
        </button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="اختر لون التدرج"
        description="معاينة الألوان كما ستظهر في بطاقة البرنامج"
        size="md"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {options.map((option) => {
            const active = option.classes === value;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => pick(option.classes)}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-2 p-1 transition-colors",
                  active ? "border-brand-green" : "border-transparent hover:border-brand-green/40"
                )}
              >
                {active && (
                  <span className="absolute end-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-white shadow">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <div
                  className="flex h-16 items-end rounded-xl p-2 sm:h-20"
                  style={{
                    background: `linear-gradient(135deg, ${option.previewFrom}, ${option.previewTo})`,
                  }}
                >
                  <span className="rounded-lg bg-black/30 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                    {option.label}
                  </span>
                </div>
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
