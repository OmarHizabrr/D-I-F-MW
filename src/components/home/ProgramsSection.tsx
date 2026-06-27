"use client";

import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardFooter, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { programsData } from "@/data/mock";
import { cn } from "@/lib/utils";

export function ProgramsSection() {
  const { t } = useLocale();

  return (
    <section id="programs" className="section-padding">
      <div className="container-dif">
        <SectionHeader title={t.programs.title} subtitle={t.programs.subtitle} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {programsData.map((program) => (
            <Card key={program.id} padding="none" className="group cursor-pointer">
              <div
                className={cn(
                  "flex h-40 items-center justify-center bg-gradient-to-br text-6xl",
                  program.color
                )}
              >
                {program.icon}
              </div>
              <div className="p-5">
                <CardTitle>
                  {t.programs.items[program.id as keyof typeof t.programs.items]}
                </CardTitle>
                <CardFooter className="mt-3 !p-0">
                  <Button variant="ghost" size="sm" className="!px-0">
                    {t.programs.viewProjects} →
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
