"use client";

import { MapPin } from "lucide-react";
import type { Donor } from "@/types/project-management";
import {
  DONOR_KIND_LABELS,
  DONOR_KIND_ICONS,
  donorDisplayName,
  resolveDonorKind,
} from "@/lib/donor-display";
import { Card } from "@/components/ui/Card";

type DonorSupporterCardProps = {
  donor: Donor;
  country?: string;
  city?: string;
  supportedByLabel: string;
  countryLabel: string;
};

export function DonorSupporterCard({
  donor,
  country,
  city,
  supportedByLabel,
  countryLabel,
}: DonorSupporterCardProps) {
  const kind = resolveDonorKind(donor);
  const Icon = DONOR_KIND_ICONS[kind];
  const location = [country, city].filter(Boolean).join(" · ");

  return (
    <Card padding="md" className="border-brand-green/20 bg-brand-green/5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green-dark dark:text-brand-green">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">{supportedByLabel}</p>
          <p className="mt-0.5 text-base font-bold text-foreground">{donorDisplayName(donor)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{DONOR_KIND_LABELS[kind]}</p>
          {donor.organization && donor.fullName && (
            <p className="mt-1 text-sm text-muted-foreground">{donor.organization}</p>
          )}
        </div>
      </div>
      {location && (
        <div className="mt-3 flex items-center gap-2 border-t border-border-subtle pt-3 text-sm">
          <MapPin className="h-4 w-4 shrink-0 text-brand-green" />
          <div>
            <p className="text-xs text-muted-foreground">{countryLabel}</p>
            <p className="font-medium">{location}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
