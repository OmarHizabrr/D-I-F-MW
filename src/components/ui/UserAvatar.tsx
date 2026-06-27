"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getInitials } from "@/types/user";

type UserAvatarProps = {
  name?: string;
  photoURL?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: { box: "h-8 w-8 text-xs", px: 32 },
  md: { box: "h-12 w-12 text-sm", px: 48 },
  lg: { box: "h-16 w-16 text-lg", px: 64 },
  xl: { box: "h-24 w-24 text-2xl", px: 96 },
};

export function UserAvatar({ name = "", photoURL, size = "md", className }: UserAvatarProps) {
  const s = sizes[size];
  const initials = getInitials(name);

  if (photoURL) {
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-full ring-2 ring-brand-green/20",
          s.box,
          className
        )}
      >
        <Image
          src={photoURL}
          alt={name || "المستخدم"}
          width={s.px}
          height={s.px}
          className="h-full w-full object-cover"
          unoptimized
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-brand-green font-bold text-white ring-2 ring-brand-green/20",
        s.box,
        className
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
