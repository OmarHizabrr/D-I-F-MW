"use client";

import { cn } from "@/lib/utils";
import { useDonation } from "@/context/DonationContext";
import { useSiteContent } from "@/context/SiteContentContext";

type DonateButtonProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "nav" | "hero";
};

const sizeClasses = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export function DonateButton({ className, size = "md", variant = "primary" }: DonateButtonProps) {
  const { openDonation } = useDonation();
  const { donation, text } = useSiteContent();

  if (!donation.enabled) return null;

  const label =
    variant === "hero" ? text(donation.heroButtonLabel) : text(donation.navButtonLabel);

  return (
    <button
      type="button"
      onClick={() => openDonation()}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition-colors",
        variant === "primary" &&
          "bg-brand-brown text-white shadow-sm hover:bg-brand-brown-light",
        variant === "nav" &&
          "bg-brand-green text-white shadow-sm hover:bg-brand-green-dark",
        variant === "hero" &&
          "bg-brand-brown text-white shadow-sm hover:bg-brand-brown-light",
        sizeClasses[size],
        className
      )}
    >
      {label}
    </button>
  );
}
