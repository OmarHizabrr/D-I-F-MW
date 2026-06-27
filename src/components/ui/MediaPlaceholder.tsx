import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { IconBox, type IconBoxVariant, type IconBoxSize } from "./IconBox";

export interface MediaPlaceholderProps {
  icon: LucideIcon;
  variant?: IconBoxVariant;
  iconSize?: IconBoxSize;
  className?: string;
  gradient?: string;
}

export function MediaPlaceholder({
  icon,
  variant = "gradient",
  iconSize = "2xl",
  className,
  gradient = "from-brand-green/25 via-brand-green/10 to-brand-brown/20",
}: MediaPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <IconBox icon={icon} variant={variant} size={iconSize} />
    </div>
  );
}
