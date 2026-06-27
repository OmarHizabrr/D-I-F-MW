"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { resolveCatalogIcon } from "@/lib/admin/icon-catalog";

const variantStyles = {
  green: "bg-brand-green/10 text-brand-green-dark dark:text-brand-green",
  brown: "bg-brand-brown/10 text-brand-brown",
  white: "bg-white/20 text-white",
  surface: "bg-surface-elevated text-brand-green shadow-sm ring-1 ring-border-subtle",
  gradient: "bg-white/15 text-white backdrop-blur-sm",
} as const;

const sizeStyles = {
  sm: { box: "h-10 w-10", icon: "h-5 w-5", img: 40 },
  md: { box: "h-12 w-12", icon: "h-6 w-6", img: 48 },
  lg: { box: "h-14 w-14", icon: "h-7 w-7", img: 56 },
  xl: { box: "h-16 w-16", icon: "h-8 w-8", img: 64 },
  "2xl": { box: "h-20 w-20", icon: "h-10 w-10", img: 80 },
} as const;

export type CmsIconBoxVariant = keyof typeof variantStyles;
export type CmsIconBoxSize = keyof typeof sizeStyles;

type CmsIconBoxProps = {
  iconKey?: string;
  iconImageUrl?: string;
  icon?: LucideIcon;
  variant?: CmsIconBoxVariant;
  size?: CmsIconBoxSize;
  className?: string;
};

export function CmsIconBox({
  iconKey,
  iconImageUrl,
  icon: IconProp,
  variant = "green",
  size = "md",
  className,
}: CmsIconBoxProps) {
  const s = sizeStyles[size];
  const Icon = IconProp || resolveCatalogIcon(iconKey || "projects");

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl",
        s.box,
        !iconImageUrl && variantStyles[variant],
        className
      )}
    >
      {iconImageUrl ? (
        <Image
          src={iconImageUrl}
          alt=""
          width={s.img}
          height={s.img}
          className="h-full w-full object-cover"
          unoptimized
        />
      ) : (
        <Icon className={s.icon} strokeWidth={1.75} />
      )}
    </div>
  );
}

/** أيقونة inline بدون صندوق — للاستخدام داخل بطاقات مخصصة */
export function CmsIconInline({
  iconKey,
  iconImageUrl,
  className,
  boxClassName,
}: {
  iconKey?: string;
  iconImageUrl?: string;
  className?: string;
  boxClassName?: string;
}) {
  const Icon = resolveCatalogIcon(iconKey || "projects");

  if (iconImageUrl) {
    return (
      <span className={cn("relative inline-flex shrink-0 overflow-hidden", boxClassName || "h-7 w-7 rounded-xl")}>
        <Image src={iconImageUrl} alt="" fill className="object-cover" unoptimized />
      </span>
    );
  }

  return <Icon className={cn("h-7 w-7 shrink-0", className)} strokeWidth={1.75} />;
}
