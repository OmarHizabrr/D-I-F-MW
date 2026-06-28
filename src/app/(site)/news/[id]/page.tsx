"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { YouTubePlayer } from "@/components/site/YouTubePlayer";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { Badge } from "@/components/ui/Badge";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { sectionIcons } from "@/lib/icons";

export default function NewsDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const { news, sectionTitles, text, loading } = useSiteContent();

  const item = useMemo(() => news.find((n) => n.id === id && n.enabled), [news, id]);

  if (loading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  if (!item) {
    notFound();
  }

  const body = text(item.body) || text(item.excerpt);

  return (
    <>
      <SitePageHeader
        title={text(item.title)}
        subtitle={text(item.excerpt) || undefined}
        backHref="/news"
        backLabel="جميع الأخبار"
      />

      <article className="section-padding bg-background">
        <div className="container-dif mx-auto max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge>{text(item.category)}</Badge>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {item.date}
            </p>
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
            <MediaPlaceholder
              icon={sectionIcons.news}
              className="mb-8 aspect-[16/10] rounded-3xl"
            />
          )}

          {item.youtubeUrl && (
            <div className="mb-8">
              <YouTubePlayer url={item.youtubeUrl} title={text(item.title)} />
            </div>
          )}

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {body || "محتوى الخبر قيد التحديث من لوحة التحكم."}
            </p>
          </div>

          <Link
            href="/news"
            className="mt-10 inline-flex rounded-2xl border border-border-subtle px-4 py-2.5 text-sm font-semibold text-brand-green hover:bg-brand-green/5"
          >
            ← {text(sectionTitles.newsReadMore).replace(" →", "").replace("→", "")} / جميع الأخبار
          </Link>
        </div>
      </article>
    </>
  );
}
