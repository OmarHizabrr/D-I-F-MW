"use client";

import { ClipboardList, CheckCircle, HardHat, FileCheck } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { howWeWorkSteps } from "@/data/mock";

const stepIcons = {
  study: ClipboardList,
  approve: CheckCircle,
  execute: HardHat,
  report: FileCheck,
};

export function HowWeWorkSection() {
  const { t } = useLocale();

  return (
    <section className="section-padding">
      <div className="container-dif">
        <SectionHeader title={t.howWeWork.title} subtitle={t.howWeWork.subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howWeWorkSteps.map((step, index) => {
            const Icon = stepIcons[step];
            const data = t.howWeWork.steps[step];
            return (
              <Card key={step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-green/10 text-brand-green-dark dark:text-brand-green">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="absolute start-4 top-4 text-3xl font-bold text-brand-green/20">
                  {index + 1}
                </span>
                <h3 className="mb-2 font-bold">{data.title}</h3>
                <p className="text-sm text-muted-foreground">{data.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
