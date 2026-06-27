"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const variants = {
  primary:
    "bg-brand-green text-white hover:bg-brand-green-dark focus-visible:ring-brand-green shadow-sm",
  secondary:
    "bg-surface border border-border text-foreground hover:bg-border-subtle focus-visible:ring-brand-green",
  outline:
    "border-2 border-brand-green text-brand-green hover:bg-brand-green/10 focus-visible:ring-brand-green",
  ghost:
    "text-foreground hover:bg-border-subtle focus-visible:ring-brand-green",
  brown:
    "bg-brand-brown text-white hover:bg-brand-brown-light focus-visible:ring-brand-brown",
  destructive:
    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive",
} as const;

const sizes = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-xl",
  md: "h-11 px-5 text-sm gap-2 rounded-2xl",
  lg: "h-12 px-7 text-base gap-2.5 rounded-2xl",
  icon: "h-11 w-11 rounded-2xl",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "relative inline-flex items-center justify-center font-semibold transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-60",
        loading && "cursor-wait",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <Spinner
          size={size === "lg" ? "md" : "sm"}
          className={cn(
            "shrink-0",
            variant === "primary" || variant === "brown" || variant === "destructive"
              ? "text-white"
              : "text-brand-green"
          )}
        />
      )}
      <span className={cn("inline-flex items-center gap-1.5", loading && "opacity-90")}>
        {loading && loadingText ? loadingText : children}
      </span>
    </button>
  )
);

Button.displayName = "Button";
