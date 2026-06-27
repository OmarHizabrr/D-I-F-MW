"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type StatusMessageCardProps = {
  icon: ReactNode;
  title: string;
  message: string;
  tone?: "success" | "error" | "warning" | "info";
  actions?: ReactNode;
  className?: string;
};

const toneStyles = {
  success: {
    card: "border-brand-green/30 bg-brand-green/5",
    icon: "bg-brand-green/10 text-brand-green-dark dark:text-brand-green",
    title: "text-brand-green-dark dark:text-brand-green",
  },
  error: {
    card: "border-destructive/25 bg-destructive/5",
    icon: "bg-destructive/10 text-destructive",
    title: "text-destructive",
  },
  warning: {
    card: "border-amber-500/30 bg-amber-500/5",
    icon: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    title: "text-amber-800 dark:text-amber-300",
  },
  info: {
    card: "border-brand-green/20 bg-surface",
    icon: "bg-brand-green/10 text-brand-green-dark dark:text-brand-green",
    title: "text-foreground",
  },
};

export function StatusMessageCard({
  icon,
  title,
  message,
  tone = "info",
  actions,
  className,
}: StatusMessageCardProps) {
  const styles = toneStyles[tone];

  return (
    <Card padding="lg" className={cn(styles.card, className)}>
      <CardContent className="flex flex-col items-center text-center">
        <div
          className={cn(
            "mb-4 flex h-16 w-16 items-center justify-center rounded-2xl",
            styles.icon
          )}
        >
          {icon}
        </div>
        <h2 className={cn("mb-2 text-lg font-bold sm:text-xl", styles.title)}>{title}</h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{message}</p>
        {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
      </CardContent>
    </Card>
  );
}

export function StatusMessageActions({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

/** أزرار شائعة */
export function StatusLinkButton({
  onClick,
  children,
  variant = "outline",
}: {
  onClick?: () => void;
  children: ReactNode;
  variant?: "outline" | "secondary";
}) {
  return (
    <Button variant={variant} onClick={onClick}>
      {children}
    </Button>
  );
}
