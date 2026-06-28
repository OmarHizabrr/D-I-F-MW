"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CmsIconInline } from "@/components/ui/CmsIconBox";

const HOME_LIMIT = 4;

export function DownloadsSection() {
  const { downloads, sectionTitles, text } = useSiteContent();
  const items = downloads.filter((d) => d.enabled).sort((a, b) => a.order - b.order).slice(0, HOME_LIMIT);

  if (!items.length) return null;

  return (
    <section id="resources" className="section-padding bg-background">
      <div className="container-dif">
        <Reveal>
          <SectionHeader
            title={text(sectionTitles.downloads)}
            subtitle={text(sectionTitles.downloadsSubtitle)}
            viewAllHref="/resources"
            viewAllLabel={text(sectionTitles.viewAll)}
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 60}>
              <Card className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-brand-green/10 text-brand-green">
                  <CmsIconInline
                    iconKey={item.iconKey}
                    iconImageUrl={item.iconImageUrl}
                    boxClassName="h-16 w-16 rounded-3xl"
                  />
                </div>
                <h3 className="mb-1 font-bold">{text(item.title)}</h3>
                {item.year && (
                  <p className="mb-2 text-xs text-muted-foreground">{item.year}</p>
                )}
                {text(item.description) && (
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {text(item.description)}
                  </p>
                )}
                {item.fileUrl ? (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center justify-center rounded-xl border-2 border-brand-green px-3.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/10"
                  >
                    {text(sectionTitles.downloadsButton)}
                  </a>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    {text(sectionTitles.downloadsButton)}
                  </Button>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
