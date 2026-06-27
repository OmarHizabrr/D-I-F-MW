import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const sizeMap = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
} as const;

export type SpinnerSize = keyof typeof sizeMap;

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label={label ?? "Loading"}
      className={cn("animate-spin text-brand-green", sizeMap[size], className)}
    />
  );
}
