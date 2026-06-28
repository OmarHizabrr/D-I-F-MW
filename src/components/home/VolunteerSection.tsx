"use client";

import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const HOME_LIMIT = 2;

export function VolunteerSection() {
  const { volunteerOpportunities, sectionTitles, text } = useSiteContent();
  const items = volunteerOpportunities
    .filter((v) => v.enabled)
    .sort((a, b) => a.order - b.order)
    .slice(0, HOME_LIMIT);

  if (!items.length) return null;

  return (
    <section id="volunteer" className="section-padding bg-brand-green/5">
      <div className="container-dif">
        <Reveal>
          <SectionHeader
            title={text(sectionTitles.volunteer)}
            subtitle={text(sectionTitles.volunteerSubtitle)}
            viewAllHref="/volunteer"
            viewAllLabel={text(sectionTitles.viewAll)}
          />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <Card>
                <CardContent className="p-5">
                  <CardTitle className="text-lg">{text(item.title)}</CardTitle>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {text(item.description)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {text(item.location) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {text(item.location)}
                      </span>
                    )}
                    {text(item.commitment) && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {text(sectionTitles.volunteerCommitment)}: {text(item.commitment)}
                      </span>
                    )}
                  </div>
                  <Link href={`/volunteer?opportunity=${item.id}`} className="mt-4 inline-block">
                    <Button size="sm">{text(sectionTitles.volunteerApply)}</Button>
                  </Link>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
