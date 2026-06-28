"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Sparkles } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { sectionIcons } from "@/lib/icons";
import type { SuccessStoryItem } from "@/types/cms";

type SuccessStoryCardProps = {
  item: SuccessStoryItem;
  readMoreLabel?: string;
  impactLabel?: string;
};

export function SuccessStoryCard({
  item,
  readMoreLabel = "اقرأ القصة",
  impactLabel = "الأثر",
}: SuccessStoryCardProps) {
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
          icon={sectionIcons.user}
          className="h-40 sm:h-44"
          gradient="from-brand-green/20 via-brand-brown/10 to-brand-green/5"
        />
      )}
      <CardContent className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge>{text(item.country)}</Badge>
          {text(item.impactHighlight) && (
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {impactLabel}: {text(item.impactHighlight)}
            </Badge>
          )}
        </div>
        <CardTitle className="line-clamp-2 text-base sm:text-lg">{text(item.title)}</CardTitle>
        {text(item.excerpt) && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{text(item.excerpt)}</p>
        )}
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          {item.publishedAt}
        </p>
        <CardFooter className="mt-4 !p-0">
          <Link
            href={`/success-stories/${item.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-green hover:underline"
          >
            {readMoreLabel} →
          </Link>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
