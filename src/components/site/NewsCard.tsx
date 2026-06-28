"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { sectionIcons } from "@/lib/icons";
import type { NewsItem } from "@/types/cms";

type NewsCardProps = {
  item: NewsItem;
  readMoreLabel?: string;
};

export function NewsCard({ item, readMoreLabel = "اقرأ المزيد" }: NewsCardProps) {
  const { text } = useSiteContent();

  return (
    <Card padding="none" className="overflow-hidden">
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
          gradient="from-brand-brown/25 via-brand-green/15 to-brand-green/5"
        />
      )}
      <CardContent className="p-4 sm:p-5">
        <Badge className="mb-3">{text(item.category)}</Badge>
        <CardTitle className="line-clamp-2 text-base sm:text-lg">{text(item.title)}</CardTitle>
        {text(item.excerpt) && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{text(item.excerpt)}</p>
        )}
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          {item.date}
        </p>
        <CardFooter className="mt-4 !p-0">
          <Link
            href={`/news/${item.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-green hover:underline"
          >
            {readMoreLabel} →
          </Link>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
