"use client";

import { Heart } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useDonation } from "@/context/DonationContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/components/ui/IconBox";

export function DonateSection() {
  const { donation, text } = useSiteContent();
  const { openDonation } = useDonation();

  if (!donation.enabled) return null;

  return (
    <section id="donate" className="section-padding">
      <div className="container-dif">
        <Card className="overflow-hidden bg-gradient-to-br from-brand-green/15 via-brand-green/5 to-brand-brown/10 text-center">
          <div className="px-6 py-10 sm:px-10 sm:py-14">
            <IconBox icon={Heart} size="lg" className="mx-auto mb-4 text-brand-green" />
            <SectionHeader
              title={text(donation.ctaTitle)}
              subtitle={text(donation.ctaSubtitle)}
              className="!mb-8"
            />
            <Button size="lg" onClick={() => openDonation()} className="min-w-[200px]">
              {text(donation.ctaButtonLabel)}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
