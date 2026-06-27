"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setSidebarOpen(mq.matches);

    function onChange(e: MediaQueryListEvent) {
      setSidebarOpen(e.matches);
    }

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /** إغلاق القائمة عند التنقل — الموبايل فقط */
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    setSidebarOpen(false);
  }, [pathname]);

  const closeSidebarIfMobile = useCallback(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden bg-background">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLinkClick={closeSidebarIfMobile}
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-[min(85vw,16rem)] flex-col border-e border-border-subtle bg-surface shadow-xl transition-all duration-300",
          "lg:static lg:z-auto lg:shadow-none",
          sidebarOpen
            ? "translate-x-0 lg:w-64 lg:shrink-0 lg:opacity-100"
            : "pointer-events-none -translate-x-full opacity-0 rtl:translate-x-full lg:w-0 lg:overflow-hidden lg:border-0 lg:opacity-0"
        )}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="admin-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
