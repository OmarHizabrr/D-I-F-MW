"use client";

import { useMemo, useState } from "react";
import { Calculator, Heart } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useDonation } from "@/context/DonationContext";
import { useLocale } from "@/context/LocaleContext";
import { calculateZakat, formatMoney } from "@/lib/zakat-calculator";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ZakatCalculatorWidget() {
  const { zakatSettings, text } = useSiteContent();
  const { openDonation } = useDonation();
  const { locale } = useLocale();

  const [cash, setCash] = useState("");
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [investments, setInvestments] = useState("");
  const [debts, setDebts] = useState("");
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => {
    if (!calculated) return null;
    return calculateZakat(
      {
        cash: Number(cash) || 0,
        goldGrams: Number(gold) || 0,
        silverGrams: Number(silver) || 0,
        investments: Number(investments) || 0,
        debts: Number(debts) || 0,
      },
      {
        goldPricePerGram: zakatSettings.goldPricePerGram,
        silverPricePerGram: zakatSettings.silverPricePerGram,
        nisabGoldGrams: zakatSettings.nisabGoldGrams,
        nisabSilverGrams: zakatSettings.nisabSilverGrams,
        zakatRate: zakatSettings.zakatRate,
      }
    );
  }, [calculated, cash, gold, silver, investments, debts, zakatSettings]);

  if (!zakatSettings.enabled) return null;

  const sym = zakatSettings.currencySymbol;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6 sm:p-8">
        <p className="mb-6 text-sm text-muted-foreground">{text(zakatSettings.pageIntro)}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={text(zakatSettings.fieldCash)}
            type="number"
            min={0}
            dir="ltr"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
          />
          <Input
            label={text(zakatSettings.fieldGold)}
            type="number"
            min={0}
            dir="ltr"
            value={gold}
            onChange={(e) => setGold(e.target.value)}
          />
          <Input
            label={text(zakatSettings.fieldSilver)}
            type="number"
            min={0}
            dir="ltr"
            value={silver}
            onChange={(e) => setSilver(e.target.value)}
          />
          <Input
            label={text(zakatSettings.fieldInvestments)}
            type="number"
            min={0}
            dir="ltr"
            value={investments}
            onChange={(e) => setInvestments(e.target.value)}
          />
          <Input
            label={text(zakatSettings.fieldDebts)}
            type="number"
            min={0}
            dir="ltr"
            value={debts}
            onChange={(e) => setDebts(e.target.value)}
            className="sm:col-span-2"
          />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{text(zakatSettings.nisabNote)}</p>
        <Button className="mt-6" onClick={() => setCalculated(true)}>
          <Calculator className="h-4 w-4" />
          {text(zakatSettings.calculateLabel)}
        </Button>
      </Card>

      <Card className="flex flex-col justify-center p-6 sm:p-8">
        {result ? (
          <div className="text-center">
            {result.meetsNisab ? (
              <>
                <p className="text-sm font-medium text-muted-foreground">
                  {text(zakatSettings.resultLabel)}
                </p>
                <p className="mt-2 text-4xl font-bold text-brand-green-dark dark:text-brand-green">
                  {formatMoney(result.zakatDue, sym, locale)}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {formatMoney(result.netWealth, sym, locale)} · Nisab{" "}
                  {formatMoney(result.nisabThreshold, sym, locale)}
                </p>
                <Button
                  className="mt-6"
                  onClick={() =>
                    openDonation({ amount: Math.ceil(result.zakatDue), recurring: false })
                  }
                >
                  <Heart className="h-4 w-4" />
                  {text(zakatSettings.donateZakatLabel)}
                </Button>
              </>
            ) : (
              <p className="text-lg font-semibold text-muted-foreground">
                {text(zakatSettings.belowNisabLabel)}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-center text-muted-foreground">
            <Calculator className="mb-4 h-12 w-12 opacity-30" />
            <p className="text-sm">{text(zakatSettings.calculateLabel)}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
