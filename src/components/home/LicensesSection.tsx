"use client";

import { FileText, Award, Stamp, BookOpen } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { licenseItems } from "@/data/mock";

const licenseIcons = {
  registration: FileText,
  licenses: Stamp,
  endorsements: Award,
  annualReports: BookOpen,
};

export function LicensesSection() {
  const { t } = useLocale();

  return (
    <section id="reports" className="section-padding">
      <div className="container-dif">
        <SectionHeader title={t.licenses.title} subtitle={t.licenses.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {licenseItems.map((key) => {
            const Icon = licenseIcons[key];
            return (
              <Card key={key} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-brown/10 text-brand-brown">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 font-bold">{t.licenses[key]}</h3>
                <Button variant="outline" size="sm">
                  PDF
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
