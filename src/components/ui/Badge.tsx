import { cn } from "@/lib/utils";

const variants = {
  default: "bg-brand-green/10 text-brand-green-dark dark:text-brand-green",
  brown: "bg-brand-brown/10 text-brand-brown",
  outline: "border border-border text-muted-foreground",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
} as const;

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
