"use client";

import Link from "next/link";
import { Shield, FileCheck, Scale, Eye } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";

const icons = [Shield, FileCheck, Scale, Eye];

export function TrustBadgesSection() {
  const { sectionTitles, text } = useSiteContent();

  const badges = [
    { title: sectionTitles.trustBadge1, desc: sectionTitles.trustBadge1Desc },
    { title: sectionTitles.trustBadge2, desc: sectionTitles.trustBadge2Desc },
    { title: sectionTitles.trustBadge3, desc: sectionTitles.trustBadge3Desc },
    { title: sectionTitles.trustBadge4, desc: sectionTitles.trustBadge4Desc },
  ];

  return (
    <section id="trust" className="section-padding bg-brand-green/5">
      <div className="container-dif">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-bold sm:text-3xl">{text(sectionTitles.trustTitle)}</h2>
            <Link
              href="/transparency"
              className="text-sm font-semibold text-brand-green hover:underline"
            >
              {text(sectionTitles.transparencyPageTitle)} →
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge, i) => {
            const Icon = icons[i] ?? Shield;
            return (
              <Reveal key={i} delay={i * 60}>
                <Card className="h-full p-5 text-center transition-shadow hover:shadow-md">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold">{text(badge.title)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{text(badge.desc)}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
