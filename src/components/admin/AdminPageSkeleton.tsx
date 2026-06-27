"use client";

import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-border-subtle via-border/60 to-border-subtle bg-[length:200%_100%]",
        className
      )}
      style={{ animation: "pulse 1.8s ease-in-out infinite, shimmer 2.4s ease-in-out infinite" }}
    />
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-2">
          <Bone className="h-7 w-48 sm:w-56" />
          <Bone className="h-4 w-full max-w-md" />
        </div>
        <Bone className="h-10 w-32 shrink-0 rounded-xl" />
      </div>

      <div className="mb-4 flex gap-2">
        <Bone className="h-8 w-16 rounded-full" />
        <Bone className="h-8 w-28 rounded-full" />
        <Bone className="h-8 w-20 rounded-full" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border-subtle bg-surface p-4 sm:p-5"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex gap-3">
              <Bone className="h-12 w-12 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Bone className="h-4 w-36" />
                <Bone className="h-3 w-24" />
                <Bone className="mt-3 h-12 w-full" />
              </div>
              <div className="hidden shrink-0 gap-2 sm:flex">
                <Bone className="h-9 w-20 rounded-xl" />
                <Bone className="h-9 w-9 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SitePageSkeleton() {
  return (
    <div className="section-padding animate-in fade-in duration-300">
      <div className="container-dif mx-auto max-w-xl space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Bone className="h-14 w-14 rounded-2xl" />
          <Bone className="h-8 w-56" />
          <Bone className="h-4 w-72 max-w-full" />
        </div>
        <div className="rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
          <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
            <Bone className="h-12 w-12 rounded-full" />
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-4/5" />
            <Bone className="mt-2 h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
