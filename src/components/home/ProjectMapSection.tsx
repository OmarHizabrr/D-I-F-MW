"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { mapPointsData, getLocalized } from "@/data/mock";
import { sectionIcons } from "@/lib/icons";

export function ProjectMapSection() {
  const { t, locale } = useLocale();
  const [selected, setSelected] = useState<(typeof mapPointsData)[0] | null>(null);

  return (
    <section className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader title={t.projectMap.title} subtitle={t.projectMap.subtitle} />

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          <Card className="relative col-span-1 min-h-[280px] overflow-hidden !p-0 lg:col-span-2 lg:min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-950 dark:to-emerald-950">
              <svg viewBox="0 0 100 80" className="h-full w-full opacity-30">
                <ellipse cx="50" cy="40" rx="45" ry="35" fill="currentColor" className="text-brand-green/20" />
              </svg>
            </div>

            {mapPointsData.map((point) => (
              <button
                key={point.id}
                type="button"
                onClick={() => setSelected(point)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 touch-target-sm transition-transform active:scale-110 hover:scale-125"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                aria-label={getLocalized(point.name, locale)}
              >
                <span className="relative flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-brand-green/30" />
                  <MapPin className="relative h-5 w-5 text-brand-green-dark drop-shadow-md sm:h-6 sm:w-6" fill="currentColor" />
                </span>
              </button>
            ))}

            <p className="absolute bottom-3 start-1/2 w-[90%] -translate-x-1/2 text-center text-[11px] text-muted-foreground sm:text-xs">
              {t.projectMap.clickHint}
            </p>
          </Card>

          <Card className="flex flex-col justify-center">
            {selected ? (
              <div>
                <h3 className="text-lg font-bold">{getLocalized(selected.name, locale)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {getLocalized(selected.country, locale)}
                </p>
                <div className="mt-4 flex h-28 items-center justify-center rounded-2xl bg-brand-green/10 sm:h-32">
                  <IconBox icon={sectionIcons.map} size="lg" />
                </div>
              </div>
            ) : (
              <div className="flex min-h-[180px] flex-col items-center justify-center text-center text-muted-foreground lg:min-h-[200px]">
                <IconBox icon={MapPin} size="lg" className="mb-3 opacity-50" />
                <p className="text-sm">{t.projectMap.clickHint}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
