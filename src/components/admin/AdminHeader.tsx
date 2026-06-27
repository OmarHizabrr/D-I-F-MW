"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function AdminHeader() {
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
    <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-surface px-6">
      <div>
        <p className="text-sm font-semibold text-foreground">مرحباً بك</p>
        <p className="text-xs text-muted-foreground">{user?.email ?? "—"}</p>
      </div>

      <Button
        variant="outline"
        size="sm"
        loading={loggingOut}
        loadingText="جاري الخروج..."
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        تسجيل الخروج
      </Button>
    </header>
  );
}
