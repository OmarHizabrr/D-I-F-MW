import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
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
    </div>
  );
}
