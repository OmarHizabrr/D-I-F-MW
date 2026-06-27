import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const variantStyles = {
  green: "bg-brand-green/10 text-brand-green-dark dark:text-brand-green",
  brown: "bg-brand-brown/10 text-brand-brown",
  white: "bg-white/20 text-white",
  surface: "bg-surface-elevated text-brand-green shadow-sm ring-1 ring-border-subtle",
  gradient: "bg-white/15 text-white backdrop-blur-sm",
} as const;

const sizeStyles = {
  sm: { box: "h-10 w-10", icon: "h-5 w-5" },
  md: { box: "h-12 w-12", icon: "h-6 w-6" },
  lg: { box: "h-14 w-14", icon: "h-7 w-7" },
  xl: { box: "h-16 w-16", icon: "h-8 w-8" },
  "2xl": { box: "h-20 w-20", icon: "h-10 w-10" },
} as const;

export type IconBoxVariant = keyof typeof variantStyles;
export type IconBoxSize = keyof typeof sizeStyles;

export interface IconBoxProps {
  icon: LucideIcon;
  variant?: IconBoxVariant;
  size?: IconBoxSize;
  className?: string;
}

export function IconBox({
  icon: Icon,
  variant = "green",
  size = "md",
  className,
}: IconBoxProps) {
  const s = sizeStyles[size];
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl",
        s.box,
        variantStyles[variant],
        className
      )}
    >
      <Icon className={s.icon} strokeWidth={1.75} />
    </div>
  );
}
