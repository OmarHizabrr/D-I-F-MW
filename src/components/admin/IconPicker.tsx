"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, ImageIcon, Search, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { FileUploadField } from "@/components/admin/FileUploadField";
import {
  getAllIconOptions,
  getCatalogIconLabel,
  iconCategories,
  resolveCatalogIcon,
} from "@/lib/admin/icon-catalog";
import { cn } from "@/lib/utils";

type IconPickerProps = {
  label?: string;
  iconKey: string;
  iconImageUrl?: string;
  onIconKeyChange: (key: string) => void;
  onIconImageChange: (url: string) => void;
  uploadFolder?: string;
};

type Tab = "icons" | "image";

export function IconPicker({
  label = "الأيقونة",
  iconKey,
  iconImageUrl = "",
  onIconKeyChange,
  onIconImageChange,
  uploadFolder = "icons",
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>(iconImageUrl ? "image" : "icons");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("الكل");

  const allOptions = useMemo(() => getAllIconOptions(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allOptions.filter((o) => {
      const matchCat = category === "الكل" || o.category === category;
      const matchSearch =
        !q ||
        o.label.toLowerCase().includes(q) ||
        o.key.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [allOptions, search, category]);

  const PreviewIcon = resolveCatalogIcon(iconKey);
  const previewLabel = iconImageUrl ? "صورة مخصصة" : getCatalogIconLabel(iconKey);

  function pickIcon(key: string) {
    onIconKeyChange(key);
    onIconImageChange("");
    setOpen(false);
  }

  function handleImageChange(url: string) {
    onIconImageChange(url);
    if (url) onIconKeyChange(iconKey || "custom");
  }

  function clearImage() {
    onIconImageChange("");
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
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-green/10 text-brand-green-dark dark:text-brand-green">
            {iconImageUrl ? (
              <Image
                src={iconImageUrl}
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <PreviewIcon className="h-4 w-4" />
            )}
          </span>
          <span className="flex-1 text-start text-foreground">{previewLabel}</span>
          <span className="text-xs text-muted-foreground">تغيير</span>
        </button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="اختر أيقونة أو صورة"
        description="أيقونة من المكتبة أو صورة مخصصة بنفس الحجم"
        size="full"
      >
        <div className="mb-4 flex gap-2 rounded-2xl bg-border-subtle/60 p-1">
          <button
            type="button"
            onClick={() => setTab("icons")}
            className={cn(
              "flex-1 rounded-xl py-2 text-sm font-medium transition-colors",
              tab === "icons" ? "bg-surface shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            مكتبة الأيقونات ({allOptions.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("image")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium transition-colors",
              tab === "image" ? "bg-surface shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ImageIcon className="h-4 w-4" />
            صورة مخصصة
          </button>
        </div>

        {tab === "icons" ? (
          <>
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="ابحث عن أيقونة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-2xl border border-border bg-input-bg pe-4 ps-10 text-sm focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              />
            </div>

            <div className="admin-scroll mb-4 flex gap-1.5 overflow-x-auto pb-1">
              {iconCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    category === cat
                      ? "bg-brand-green text-white"
                      : "bg-border-subtle text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">لا توجد نتائج</p>
            ) : (
              <div className="grid max-h-[45vh] grid-cols-3 gap-2 overflow-y-auto overscroll-contain sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {filtered.map(({ key, label: optLabel, icon: Icon }) => {
                  const active = !iconImageUrl && key === iconKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => pickIcon(key)}
                      className={cn(
                        "relative flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center transition-colors",
                        active
                          ? "border-brand-green bg-brand-green/10"
                          : "border-border-subtle hover:border-brand-green/40 hover:bg-brand-green/5"
                      )}
                    >
                      {active && (
                        <span className="absolute end-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-dark dark:text-brand-green">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="line-clamp-2 text-[10px] font-medium leading-tight text-foreground">
                        {optLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ارفع صورة PNG أو JPG — ستظهر بنفس حجم الأيقونة في الموقع
            </p>
            <FileUploadField
              label="صورة الأيقونة"
              folder={uploadFolder}
              accept="image/*"
              value={iconImageUrl}
              onChange={handleImageChange}
            />
            {iconImageUrl && (
              <div className="flex items-center gap-4 rounded-2xl border border-border-subtle p-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-green/10">
                  <Image
                    src={iconImageUrl}
                    alt="معاينة"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">معاينة الحجم الفعلي</p>
                  <p className="text-xs text-muted-foreground">كما ستظهر في بطاقة القسم</p>
                </div>
                <Button variant="destructive" size="sm" onClick={clearImage}>
                  <Trash2 className="h-4 w-4" />
                  حذف
                </Button>
              </div>
            )}
            <Button
              onClick={() => {
                if (iconImageUrl) setOpen(false);
              }}
              disabled={!iconImageUrl}
            >
              اعتماد الصورة
            </Button>
          </div>
        )}

        <div className="mt-4 flex justify-end border-t border-border-subtle pt-4">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            إغلاق
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export { getCatalogIconLabel };
