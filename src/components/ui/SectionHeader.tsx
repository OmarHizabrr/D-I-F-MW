import { cn } from "@/lib/utils";
import { SiteLink } from "@/components/site/SiteLink";
import { ArrowLeft } from "lucide-react";

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
  viewAllHref,
  viewAllLabel = "عرض الكل",
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className={cn(centered && "text-center", "mb-8 md:mb-12", className)}>
      <h2 className="text-xl font-bold text-brand-green-dark dark:text-brand-green sm:text-2xl md:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-green" />
      {viewAllHref && (
        <SiteLink
          href={viewAllHref}
          className={cn(
            "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green transition-colors hover:text-brand-green-dark dark:hover:text-brand-green-light",
            centered && "mx-auto"
          )}
        >
          {viewAllLabel}
          <ArrowLeft className="h-4 w-4" />
        </SiteLink>
      )}
    </div>
  );
}
