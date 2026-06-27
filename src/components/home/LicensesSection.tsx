"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CmsIconInline } from "@/components/ui/CmsIconBox";

export function LicensesSection() {
  const { licenses, sectionTitles, text } = useSiteContent();
  const items = licenses.filter((l) => l.enabled).sort((a, b) => a.order - b.order);

  return (
    <section id="reports" className="section-padding">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.licenses)}
          subtitle={text(sectionTitles.licensesSubtitle)}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            return (
              <Card key={item.id} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-brand-brown/10 text-brand-brown">
                  <CmsIconInline
                    iconKey={item.iconKey}
                    iconImageUrl={item.iconImageUrl}
                    boxClassName="h-16 w-16 rounded-3xl"
                  />
                </div>
                <h3 className="mb-3 font-bold">{text(item.title)}</h3>
                {item.pdfUrl ? (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center justify-center rounded-xl border-2 border-brand-green px-3.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/10"
                  >
                    {text(sectionTitles.licensesPdf)}
                  </a>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    {text(sectionTitles.licensesPdf)}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
