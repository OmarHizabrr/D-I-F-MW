export type ZakatInput = {
  cash: number;
  goldGrams: number;
  silverGrams: number;
  investments: number;
  debts: number;
};

export type ZakatRates = {
  goldPricePerGram: number;
  silverPricePerGram: number;
  nisabGoldGrams: number;
  nisabSilverGrams: number;
  zakatRate: number;
};

export type ZakatResult = {
  totalWealth: number;
  netWealth: number;
  nisabThreshold: number;
  zakatDue: number;
  meetsNisab: boolean;
  nisabBasis: "gold" | "silver";
};

export function calculateZakat(input: ZakatInput, rates: ZakatRates): ZakatResult {
  const goldValue = input.goldGrams * rates.goldPricePerGram;
  const silverValue = input.silverGrams * rates.silverPricePerGram;
  const totalWealth = input.cash + goldValue + silverValue + input.investments;
  const netWealth = Math.max(0, totalWealth - input.debts);

  const goldNisab = rates.nisabGoldGrams * rates.goldPricePerGram;
  const silverNisab = rates.nisabSilverGrams * rates.silverPricePerGram;
  const useGold = goldNisab <= silverNisab;
  const nisabThreshold = useGold ? goldNisab : silverNisab;
  const meetsNisab = netWealth >= nisabThreshold;
  const zakatDue = meetsNisab ? netWealth * rates.zakatRate : 0;

  return {
    totalWealth,
    netWealth,
    nisabThreshold,
    zakatDue,
    meetsNisab,
    nisabBasis: useGold ? "gold" : "silver",
  };
}

export function formatMoney(amount: number, symbol: string, locale = "ar"): string {
  const formatted = amount.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}
