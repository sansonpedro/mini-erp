const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BRL",
});

export function formatMoney(amountInCents: number) {
  return moneyFormatter.format(amountInCents / 100);
}
