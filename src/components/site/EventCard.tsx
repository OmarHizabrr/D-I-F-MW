"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { sectionIcons } from "@/lib/icons";
import type { EventItem } from "@/types/cms";

type EventCardProps = {
  item: EventItem;
  readMoreLabel?: string;
  locationLabel?: string;
  registerLabel?: string;
};

export function EventCard({
  item,
  readMoreLabel = "التفاصيل",
  locationLabel = "الموقع",
  registerLabel = "سجّل الآن",
}: EventCardProps) {
  const { text } = useSiteContent();

  return (
    <Card padding="none" className="overflow-hidden transition-shadow hover:shadow-md">
      {item.imageUrl ? (
        <div className="relative h-40 sm:h-44">
          <Image
            src={item.imageUrl}
            alt={text(item.title)}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <MediaPlaceholder
          icon={sectionIcons.news}
          className="h-40 sm:h-44"
          gradient="from-brand-brown/20 via-brand-green/10 to-brand-green/5"
        />
      )}
      <CardContent className="p-4 sm:p-5">
        <CardTitle className="line-clamp-2 text-base sm:text-lg">{text(item.title)}</CardTitle>
        {text(item.excerpt) && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{text(item.excerpt)}</p>
        )}
        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {item.startDate}
            {item.endDate && item.endDate !== item.startDate ? ` — ${item.endDate}` : ""}
          </p>
          {text(item.location) && (
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {locationLabel}: {text(item.location)}
            </p>
          )}
        </div>
        <CardFooter className="mt-4 flex flex-wrap gap-3 !p-0">
          <Link
            href={`/events/${item.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-green hover:underline"
          >
            {readMoreLabel} →
          </Link>
          {item.registrationUrl && (
            <a
              href={item.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-brown hover:underline"
            >
              {registerLabel}
            </a>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
