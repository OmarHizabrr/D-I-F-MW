"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "dif-campaign-banner-dismissed";

export function CampaignBanner() {
  const { campaignBanner, text } = useSiteContent();
  const { t } = useLocale();
  const [dismissed, setDismissed] = useState(true);

  const messageKey = text(campaignBanner.message);

  useEffect(() => {
    if (!campaignBanner.enabled) return;
    if (campaignBanner.endDate && campaignBanner.endDate < new Date().toISOString().slice(0, 10)) {
      return;
    }
    if (campaignBanner.dismissible) {
      const wasDismissed = localStorage.getItem(DISMISS_KEY) === messageKey;
      setDismissed(wasDismissed);
    } else {
      setDismissed(false);
    }
  }, [campaignBanner, messageKey]);

  if (!campaignBanner.enabled || dismissed) return null;
  if (campaignBanner.endDate && campaignBanner.endDate < new Date().toISOString().slice(0, 10)) {
    return null;
  }

  function handleDismiss() {
    setDismissed(true);
    if (campaignBanner.dismissible) {
      localStorage.setItem(DISMISS_KEY, messageKey);
    }
  }

  const variantClass =
    campaignBanner.variant === "urgent"
      ? "bg-brand-brown text-white"
      : campaignBanner.variant === "campaign"
        ? "bg-brand-green text-white"
        : "bg-brand-green/90 text-white";

  return (
    <div className={cn("relative w-full px-4 py-2.5 text-center text-sm", variantClass)}>
      <p className="mx-auto max-w-4xl pe-8">
        {text(campaignBanner.message)}{" "}
        {campaignBanner.linkHref && (
          <Link
            href={campaignBanner.linkHref}
            className="font-bold underline underline-offset-2 hover:opacity-90"
          >
            {text(campaignBanner.linkLabel)}
          </Link>
        )}
      </p>
      {campaignBanner.dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg p-1 hover:bg-white/15"
          aria-label={t.common.close}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
