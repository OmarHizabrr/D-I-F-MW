"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { statsData } from "@/data/mock";
import { statIcons, type StatIconKey } from "@/lib/icons";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

export function StatsSection() {
  const { t } = useLocale();

  return (
    <section className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader title={t.stats.title} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {statsData.map((stat, i) => {
            const Icon = statIcons[stat.icon as StatIconKey];
            return (
              <Card
                key={stat.labelKey}
                className="animate-count-up flex flex-col items-center text-center"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <IconBox icon={Icon} size="md" />
                <p className="mt-3 text-xl font-bold text-brand-green-dark dark:text-brand-green sm:text-2xl md:text-3xl">
                  <AnimatedNumber value={stat.value} />
                </p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground sm:text-xs md:text-sm">
                  {t.stats[stat.labelKey]}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
