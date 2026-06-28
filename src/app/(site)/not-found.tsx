"use client";

import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function SiteNotFound() {
  return (
    <div className="section-padding">
      <div className="container-dif flex min-h-[50vh] flex-col items-center justify-center text-center">
        <SearchX className="mb-4 h-16 w-16 text-brand-green/40" />
        <h1 className="text-2xl font-bold text-brand-green-dark dark:text-brand-green sm:text-3xl">
          الصفحة غير موجودة
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          الرابط الذي طلبته غير متاح. جرّب العودة للرئيسية أو تصفّح أقسام الموقع.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-brand-green px-5 text-sm font-semibold text-white hover:bg-brand-green-dark"
          >
            <Home className="h-4 w-4" />
            الرئيسية
          </Link>
          <Link
            href="/projects"
            className="inline-flex h-11 items-center rounded-2xl border-2 border-brand-green px-5 text-sm font-semibold text-brand-green hover:bg-brand-green/10"
          >
            المشاريع
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-2xl border-2 border-brand-green px-5 text-sm font-semibold text-brand-green hover:bg-brand-green/10"
          >
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}
