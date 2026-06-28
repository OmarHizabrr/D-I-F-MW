type PaymentUrlParams = {
  amount: number;
  name: string;
  email: string;
  currencyCode: string;
};

export function buildDonationPaymentUrl(template: string, params: PaymentUrlParams): string {
  if (!template.trim()) return "";

  const encoded = {
    amount: String(params.amount),
    name: encodeURIComponent(params.name),
    email: encodeURIComponent(params.email),
    currency: encodeURIComponent(params.currencyCode),
  };

  return template
    .replace(/\{amount\}/g, encoded.amount)
    .replace(/\{name\}/g, encoded.name)
    .replace(/\{email\}/g, encoded.email)
    .replace(/\{currency\}/g, encoded.currency);
}

export function formatDonationAmount(amount: number, symbol: string): string {
  return `${symbol}${amount.toLocaleString()}`;
}
