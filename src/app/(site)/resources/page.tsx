"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SitePageHeader } from "@/components/site/SitePageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CmsIconInline } from "@/components/ui/CmsIconBox";
import { SitePageSkeleton } from "@/components/admin/AdminPageSkeleton";

export default function ResourcesPage() {
  const { downloads, sectionTitles, text, loading } = useSiteContent();
  const items = downloads.filter((d) => d.enabled).sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="section-padding">
        <SitePageSkeleton />
      </div>
    );
  }

  return (
    <>
      <SitePageHeader
        title={text(sectionTitles.resourcesPageTitle)}
        subtitle={text(sectionTitles.resourcesPageSubtitle)}
        breadcrumbs={[{ label: text(sectionTitles.resourcesPageTitle) }]}
      />
      <div className="section-padding bg-background">
        <div className="container-dif">
          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">لا توجد موارد للتحميل حالياً</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-brand-green/10 text-brand-green">
                    <CmsIconInline
                      iconKey={item.iconKey}
                      iconImageUrl={item.iconImageUrl}
                      boxClassName="h-16 w-16 rounded-3xl"
                    />
                  </div>
                  <h3 className="mb-1 font-bold">{text(item.title)}</h3>
                  {item.year && <p className="mb-2 text-xs text-muted-foreground">{item.year}</p>}
                  {text(item.description) && (
                    <p className="mb-4 text-sm text-muted-foreground">{text(item.description)}</p>
                  )}
                  {item.fileUrl ? (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-green px-4 text-sm font-semibold text-white hover:bg-brand-green-dark"
                    >
                      {text(sectionTitles.downloadsButton)}
                    </a>
                  ) : (
                    <Button disabled>{text(sectionTitles.downloadsButton)}</Button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
