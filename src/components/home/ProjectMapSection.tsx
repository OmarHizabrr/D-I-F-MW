"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { mapPointsData, getLocalized } from "@/data/mock";

export function ProjectMapSection() {
  const { t, locale } = useLocale();
  const [selected, setSelected] = useState<(typeof mapPointsData)[0] | null>(null);

  return (
    <section className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader title={t.projectMap.title} subtitle={t.projectMap.subtitle} />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="relative col-span-2 min-h-[400px] overflow-hidden !p-0">
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
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                aria-label={getLocalized(point.name, locale)}
              >
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-brand-green/40" />
                  <MapPin className="relative h-6 w-6 text-brand-green-dark drop-shadow-md" fill="currentColor" />
                </span>
              </button>
            ))}

            <p className="absolute bottom-4 start-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              {t.projectMap.clickHint}
            </p>
          </Card>

          <Card>
            {selected ? (
              <div>
                <h3 className="text-lg font-bold">{getLocalized(selected.name, locale)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {getLocalized(selected.country, locale)}
                </p>
                <div className="mt-4 flex h-32 items-center justify-center rounded-xl bg-brand-green/10 text-4xl">
                  🗺️
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
                <MapPin className="mb-3 h-10 w-10 text-brand-green/40" />
                <p className="text-sm">{t.projectMap.clickHint}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
