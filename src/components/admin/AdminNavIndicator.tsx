"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** شريط تقدّم خفيف عند التنقل بين صفحات لوحة التحكم */
export function AdminNavIndicator() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = window.setTimeout(() => setActive(false), 700);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className="pointer-events-none relative z-10 h-0.5 shrink-0 overflow-hidden bg-border-subtle/40"
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-y-0 start-0 h-full w-1/3 rounded-full bg-gradient-to-r from-brand-green/20 via-brand-green to-brand-green/20",
          active ? "animate-loading-bar opacity-100" : "opacity-0 transition-opacity duration-300"
        )}
      />
    </div>
  );
}
