"use client";

import { useLocale } from "@/context/LocaleContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardFooter, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/components/ui/IconBox";
import { programsData } from "@/data/mock";
import { programIcons, type ProgramIconKey } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function ProgramsSection() {
  const { t } = useLocale();

  return (
    <section id="programs" className="section-padding">
      <div className="container-dif">
        <SectionHeader title={t.programs.title} subtitle={t.programs.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {programsData.map((program) => {
            const Icon = programIcons[program.id as ProgramIconKey];
            return (
              <Card key={program.id} padding="none" className="group cursor-pointer overflow-hidden">
                <div
                  className={cn(
                    "flex h-36 items-center justify-center bg-gradient-to-br sm:h-40",
                    program.color
                  )}
                >
                  <IconBox icon={Icon} variant="gradient" size="2xl" />
                </div>
                <div className="p-4 sm:p-5">
                  <CardTitle className="text-base sm:text-lg">
                    {t.programs.items[program.id as keyof typeof t.programs.items]}
                  </CardTitle>
                  <CardFooter className="mt-3 !p-0">
                    <Button variant="ghost" size="sm" className="!rounded-xl !px-0">
                      {t.programs.viewProjects} →
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
