"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { sectionIcons } from "@/lib/icons";
import type { MapPointItem } from "@/types/cms";

export function ProjectMapSection() {
  const { mapPoints, sectionTitles, text } = useSiteContent();
  const points = mapPoints.filter((p) => p.enabled);
  const [selected, setSelected] = useState<MapPointItem | null>(null);

  return (
    <section className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.map)}
          subtitle={text(sectionTitles.mapSubtitle)}
        />

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          <Card className="relative col-span-1 min-h-[280px] overflow-hidden !p-0 lg:col-span-2 lg:min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-950 dark:to-emerald-950">
              <svg viewBox="0 0 100 80" className="h-full w-full opacity-30">
                <ellipse
                  cx="50"
                  cy="40"
                  rx="45"
                  ry="35"
                  fill="currentColor"
                  className="text-brand-green/20"
                />
              </svg>
            </div>

            {points.map((point) => (
              <button
                key={point.id}
                type="button"
                onClick={() => setSelected(point)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 touch-target-sm transition-transform active:scale-110 hover:scale-125"
                style={{ left: `${point.mapX}%`, top: `${point.mapY}%` }}
                aria-label={text(point.name)}
              >
                <span className="relative flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-brand-green/30" />
                  <MapPin
                    className="relative h-5 w-5 text-brand-green-dark drop-shadow-md sm:h-6 sm:w-6"
                    fill="currentColor"
                  />
                </span>
              </button>
            ))}

            <p className="absolute bottom-3 start-1/2 w-[90%] -translate-x-1/2 text-center text-[11px] text-muted-foreground sm:text-xs">
              {text(sectionTitles.mapHint)}
            </p>
          </Card>

          <Card className="flex flex-col justify-center">
            {selected ? (
              <div>
                <h3 className="text-lg font-bold">{text(selected.name)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text(selected.country)}</p>
                <div className="mt-4 flex h-28 items-center justify-center rounded-2xl bg-brand-green/10 sm:h-32">
                  <IconBox icon={sectionIcons.map} size="lg" />
                </div>
              </div>
            ) : (
              <div className="flex min-h-[180px] flex-col items-center justify-center text-center text-muted-foreground lg:min-h-[200px]">
                <IconBox icon={MapPin} size="lg" className="mb-3 opacity-50" />
                <p className="text-sm">{text(sectionTitles.mapHint)}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
