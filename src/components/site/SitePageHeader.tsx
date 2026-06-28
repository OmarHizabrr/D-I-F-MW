"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Breadcrumb = {
  label: string;
  href?: string;
};

type SitePageHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  breadcrumbs?: Breadcrumb[];
  className?: string;
};

export function SitePageHeader({
  title,
  subtitle,
  backHref = "/",
  backLabel = "العودة للرئيسية",
  breadcrumbs,
  className,
}: SitePageHeaderProps) {
  const crumbs = breadcrumbs ?? [{ label: title }];

  return (
    <div className={cn("border-b border-border-subtle bg-surface", className)}>
      <div className="container-dif py-8 sm:py-10">
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand-green hover:underline"
        >
          <ArrowRight className="h-4 w-4" />
          {backLabel}
        </Link>
        <h1 className="text-2xl font-bold text-brand-green-dark dark:text-brand-green sm:text-3xl md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-brand-green">
            الرئيسية
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-brand-green">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
