"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { sectionIcons } from "@/lib/icons";

export function LatestNewsSection() {
  const { news, sectionTitles, text } = useSiteContent();
  const items = news.filter((n) => n.enabled).sort((a, b) => a.order - b.order);

  return (
    <section id="news" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.news)}
          subtitle={text(sectionTitles.newsSubtitle)}
        />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} padding="none" className="overflow-hidden">
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
                <CardTitle className="line-clamp-2 text-base sm:text-lg">
                  {text(item.title)}
                </CardTitle>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {item.date}
                </p>
                <CardFooter className="mt-4 !p-0">
                  <Button variant="ghost" size="sm" className="!rounded-xl !px-0">
                    {text(sectionTitles.newsReadMore)} →
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
