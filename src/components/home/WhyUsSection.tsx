"use client";

import { Shield, Eye, FileText, Users, CheckCircle, Award } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

const whyUsIcons = [Shield, Eye, FileText, Users, CheckCircle, Award];
const whyUsKeys = ["transparency", "followUp", "reports", "team", "documented", "quality"] as const;

export function WhyUsSection() {
  const { t } = useLocale();

  return (
    <section id="about" className="section-padding bg-brand-green/5 dark:bg-brand-green/10">
      <div className="container-dif">
        <SectionHeader title={t.whyUs.title} subtitle={t.whyUs.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyUsKeys.map((key, i) => {
            const Icon = whyUsIcons[i];
            return (
              <Card key={key} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold">{t.whyUs.items[key]}</h3>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
