const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatMoney(amountInCents: number) {
  return moneyFormatter.format(amountInCents / 100);
}
