"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, PartyPopper } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLoading } from "@/context/LoadingContext";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { buildDonationPaymentUrl, formatDonationAmount } from "@/lib/donation-url";
import { submitDonationIntent } from "@/services/donationService";
import { cn } from "@/lib/utils";

type DonationModalProps = {
  open: boolean;
  onClose: () => void;
};

export function DonationModal({ open, onClose }: DonationModalProps) {
  const { donation, text } = useSiteContent();
  const { withLoading } = useLoading();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const amounts = useMemo(
    () => donation.presetAmounts.filter((a) => a > 0).slice(0, 8),
    [donation.presetAmounts]
  );

  const resolvedAmount = useMemo(() => {
    if (selectedAmount !== null) return selectedAmount;
    const parsed = Number(customAmount);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return parsed;
  }, [selectedAmount, customAmount]);

  useEffect(() => {
    if (!open) return;
    setSuccess(false);
    setSelectedAmount(amounts[1] ?? amounts[0] ?? null);
    setCustomAmount("");
    setName("");
    setEmail("");
  }, [open, amounts]);

  if (!donation.enabled) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resolvedAmount || resolvedAmount < donation.minAmount) return;
    if (!name.trim() || !email.trim()) return;

    await withLoading(async () => {
      const status =
        donation.paymentMode === "external" && donation.externalPaymentUrl.trim()
          ? ("redirected" as const)
          : ("recorded" as const);

      await submitDonationIntent({
        amount: resolvedAmount,
        currencyCode: donation.currencyCode,
        donorName: name.trim(),
        donorEmail: email.trim(),
        status,
      });

      if (status === "redirected") {
        const url = buildDonationPaymentUrl(donation.externalPaymentUrl, {
          amount: resolvedAmount,
          name: name.trim(),
          email: email.trim(),
          currencyCode: donation.currencyCode,
        });
        if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }

      setSuccess(true);
    }, "save");
  }

  function handleClose() {
    setSuccess(false);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={success ? "" : text(donation.modalTitle)}
      description={success ? undefined : text(donation.modalSubtitle)}
      size="md"
      footer={
        success ? (
          <Button onClick={handleClose} className="w-full sm:w-auto">
            {text(donation.okLabel)}
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose} className="w-full sm:w-auto">
              {text(donation.cancelLabel)}
            </Button>
            <Button
              type="submit"
              form="donation-form"
              className="w-full sm:w-auto"
              disabled={!resolvedAmount || resolvedAmount < donation.minAmount}
            >
              {text(donation.submitLabel)}
            </Button>
          </>
        )
      }
    >
      {success ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
            <PartyPopper className="h-8 w-8" />
          </div>
          <p className="text-lg font-semibold text-brand-green-dark dark:text-brand-green">
            {text(donation.successMessage)}
          </p>
        </div>
      ) : (
        <form id="donation-form" className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <p className="mb-3 text-sm font-medium">{text(donation.amountLabel)}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "rounded-2xl border-2 px-3 py-3 text-sm font-bold transition-colors",
                    selectedAmount === amount && !customAmount
                      ? "border-brand-green bg-brand-green/10 text-brand-green-dark dark:text-brand-green"
                      : "border-border hover:border-brand-green/40"
                  )}
                >
                  {formatDonationAmount(amount, donation.currencySymbol)}
                </button>
              ))}
            </div>
            {donation.allowCustomAmount && (
              <div className="mt-3">
                <Input
                  label={text(donation.customAmountLabel)}
                  type="number"
                  min={donation.minAmount}
                  dir="ltr"
                  placeholder={`${donation.currencySymbol}${donation.minAmount}`}
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                />
              </div>
            )}
          </div>

          <Input
            label={text(donation.nameLabel)}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label={text(donation.emailLabel)}
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Heart className="h-3.5 w-3.5 shrink-0 text-brand-green" />
            {donation.paymentMode === "external" && donation.externalPaymentUrl
              ? text(donation.paymentHintExternal)
              : text(donation.paymentHintRecord)}
          </p>
        </form>
      )}
    </Dialog>
  );
}
