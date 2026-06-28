"use client";

import Link from "next/link";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardFooter, CardTitle } from "@/components/ui/Card";
import { CmsIconBox } from "@/components/ui/CmsIconBox";
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
          viewAllHref="/projects"
          viewAllLabel={text(sectionTitles.viewAll)}
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((program) => (
            <Link key={program.id} href="/projects">
              <Card padding="none" className="group overflow-hidden transition-transform hover:scale-[1.02]">
                <div
                  className={cn(
                    "flex h-36 items-center justify-center bg-gradient-to-br sm:h-40",
                    program.color,
                    program.imageUrl && "bg-cover bg-center"
                  )}
                  style={program.imageUrl ? { backgroundImage: `url(${program.imageUrl})` } : undefined}
                >
                  {!program.imageUrl && (
                    <CmsIconBox
                      iconKey={program.iconKey}
                      iconImageUrl={program.iconImageUrl}
                      variant="gradient"
                      size="2xl"
                    />
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <CardTitle className="text-base sm:text-lg">{text(program.title)}</CardTitle>
                  <CardFooter className="mt-3 !p-0 text-sm font-semibold text-brand-green">
                    → {text(sectionTitles.viewAll)}
                  </CardFooter>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
