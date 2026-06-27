"use client";

import { Calendar } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { newsData, getLocalized } from "@/data/mock";

export function LatestNewsSection() {
  const { t, locale } = useLocale();

  return (
    <section id="news" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader title={t.latestNews.title} subtitle={t.latestNews.subtitle} />
        <div className="grid gap-6 md:grid-cols-3">
          {newsData.map((item) => (
            <Card key={item.id} padding="none">
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-brand-brown/30 to-brand-green/30 text-4xl">
                📰
              </div>
              <CardContent className="p-5">
                <Badge className="mb-3">{getLocalized(item.category, locale)}</Badge>
                <CardTitle className="line-clamp-2">{getLocalized(item.title, locale)}</CardTitle>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {item.date}
                </p>
                <CardFooter className="mt-4 !p-0">
                  <Button variant="ghost" size="sm" className="!px-0">
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
