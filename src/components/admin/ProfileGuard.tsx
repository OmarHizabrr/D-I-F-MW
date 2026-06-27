"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Spinner";

export function ProfileGuard({ children }: { children: ReactNode }) {
  const { userProfile, profileLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (profileLoading) return;
    if (userProfile && !userProfile.profileComplete && pathname !== "/admin/complete-profile") {
      router.replace("/admin/complete-profile");
    }
  }, [userProfile, profileLoading, pathname, router]);

  if (profileLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" label="جاري تحميل الملف..." />
      </div>
    );
  }

  if (userProfile && !userProfile.profileComplete) {
    return null;
  }

  return <>{children}</>;
}
