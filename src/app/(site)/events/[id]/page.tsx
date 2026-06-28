"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { Button } from "@/components/ui/Button";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { sectionIcons } from "@/lib/icons";

export default function EventDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const { events, sectionTitles, text, loading } = useSiteContent();

  const item = useMemo(() => events.find((e) => e.id === id && e.enabled), [events, id]);

  if (loading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  if (!item) notFound();

  const body = text(item.body) || text(item.excerpt);

  return (
    <>
      <SitePageHeader
        title={text(item.title)}
        subtitle={text(item.excerpt) || undefined}
        backHref="/events"
        backLabel={text(sectionTitles.eventsPageTitle)}
      />
      <article className="section-padding bg-background">
        <div className="container-dif mx-auto max-w-3xl">
          <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {item.startDate}
              {item.endDate && item.endDate !== item.startDate ? ` — ${item.endDate}` : ""}
            </p>
            {text(item.location) && (
              <p className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {text(sectionTitles.eventsLocation)}: {text(item.location)}
              </p>
            )}
          </div>

          {item.imageUrl ? (
            <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-3xl border border-border-subtle">
              <Image
                src={item.imageUrl}
                alt={text(item.title)}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          ) : (
            <MediaPlaceholder icon={sectionIcons.news} className="mb-8 aspect-[16/10] rounded-3xl" />
          )}

          <p className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
            {body || "تفاصيل الفعالية قيد التحديث من لوحة التحكم."}
          </p>

          {item.registrationUrl && (
            <a
              href={item.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block"
            >
              <Button>{text(sectionTitles.eventsRegister)}</Button>
            </a>
          )}

          <Link
            href="/events"
            className="mt-6 block text-sm font-semibold text-brand-green hover:underline"
          >
            ← {text(sectionTitles.eventsPageTitle)}
          </Link>
        </div>
      </article>
    </>
  );
}
