"use client";

import { Calendar } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { newsData, getLocalized } from "@/data/mock";
import { sectionIcons } from "@/lib/icons";

export function LatestNewsSection() {
  const { t, locale } = useLocale();

  return (
    <section id="news" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader title={t.latestNews.title} subtitle={t.latestNews.subtitle} />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsData.map((item) => (
            <Card key={item.id} padding="none" className="overflow-hidden">
              <MediaPlaceholder
                icon={sectionIcons.news}
                className="h-40 sm:h-44"
                gradient="from-brand-brown/25 via-brand-green/15 to-brand-green/5"
              />
              <CardContent className="p-4 sm:p-5">
                <Badge className="mb-3">{getLocalized(item.category, locale)}</Badge>
                <CardTitle className="line-clamp-2 text-base sm:text-lg">
                  {getLocalized(item.title, locale)}
                </CardTitle>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {item.date}
                </p>
                <CardFooter className="mt-4 !p-0">
                  <Button variant="ghost" size="sm" className="!rounded-xl !px-0">
                    {t.latestNews.readMore} →
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
