"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardFooter, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/components/ui/IconBox";
import { programIcons, type ProgramIconKey } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function ProgramsSection() {
  const { programs, sectionTitles, text } = useSiteContent();
  const items = programs.filter((p) => p.enabled).sort((a, b) => a.order - b.order);

  return (
    <section id="programs" className="section-padding">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.programs)}
          subtitle={text(sectionTitles.programsSubtitle)}
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((program) => {
            const Icon = programIcons[program.iconKey as ProgramIconKey] || programIcons.community;
            return (
              <Card key={program.id} padding="none" className="group cursor-pointer overflow-hidden">
                <div
                  className={cn(
                    "flex h-36 items-center justify-center bg-gradient-to-br sm:h-40",
                    program.color,
                    program.imageUrl && "bg-cover bg-center"
                  )}
                  style={program.imageUrl ? { backgroundImage: `url(${program.imageUrl})` } : undefined}
                >
                  {!program.imageUrl && <IconBox icon={Icon} variant="gradient" size="2xl" />}
                </div>
                <div className="p-4 sm:p-5">
                  <CardTitle className="text-base sm:text-lg">{text(program.title)}</CardTitle>
                  <CardFooter className="mt-3 !p-0">
                    <Button variant="ghost" size="sm" className="!rounded-xl !px-0">
                      →
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
