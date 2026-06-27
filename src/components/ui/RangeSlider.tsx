"use client";

import { cn } from "@/lib/utils";

export interface RangeSliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  showValue?: boolean;
  className?: string;
}

function progressTone(value: number) {
  if (value >= 80) return "text-brand-green";
  if (value >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-orange-600 dark:text-orange-400";
}

function progressBarColor(value: number) {
  if (value >= 80) return "bg-brand-green";
  if (value >= 50) return "bg-amber-500";
  return "bg-orange-500";
}

export function RangeSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  hint,
  showValue = true,
  className,
}: RangeSliderProps) {
  const clamped = Math.min(max, Math.max(min, value));

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showValue && (
            <span className={cn("text-sm font-bold tabular-nums", progressTone(clamped))}>
              {clamped}%
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center gap-3">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-border-subtle">
          <div
            className={cn("h-full rounded-full transition-all duration-150", progressBarColor(clamped))}
            style={{ width: `${clamped}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={clamped}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
