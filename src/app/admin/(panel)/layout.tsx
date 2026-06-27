"use client";

import { AuthGuard } from "@/components/admin/AuthGuard";
import { ProfileGuard } from "@/components/admin/ProfileGuard";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ProfileGuard>
        <AdminShell>{children}</AdminShell>
      </ProfileGuard>
    </AuthGuard>
  );
}
