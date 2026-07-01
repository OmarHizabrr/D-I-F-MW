"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToCurrentHash() {
  const id = window.location.hash.replace(/^#+/, "").split("#").pop();
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/** تمرير سلس إلى مرساة الصفحة بعد التنقل (مثل /#achievements) */
export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    scrollToCurrentHash();
    window.addEventListener("hashchange", scrollToCurrentHash);
    return () => window.removeEventListener("hashchange", scrollToCurrentHash);
  }, [pathname]);

  return null;
}
