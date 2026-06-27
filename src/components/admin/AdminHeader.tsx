"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, PanelLeftClose, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

type AdminHeaderProps = {
  sidebarOpen?: boolean;
  onMenuToggle?: () => void;
};

export function AdminHeader({ sidebarOpen, onMenuToggle }: AdminHeaderProps) {
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-surface px-4 sm:h-16 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-xl p-2 text-foreground hover:bg-border-subtle"
          aria-label={sidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">مرحباً بك</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email ?? "—"}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-border-subtle sm:inline-flex"
        >
          <ExternalLink className="h-4 w-4" />
          الموقع
        </Link>
        <Button
          variant="outline"
          size="sm"
          loading={loggingOut}
          loadingText="..."
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">خروج</span>
        </Button>
      </div>
    </header>
  );
}
