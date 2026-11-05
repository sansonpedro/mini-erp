import { formatMoney } from "@/lib/format-money";

type Sale = { id: string; totalInCents: number; createdAt: Date; items: Array<{ quantity: number; product: { name: string; sku: string } }> };

export function SaleList({ sales }: { sales: Sale[] }) {
  if (sales.length === 0) return <p className="rounded-xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">No sales recorded yet.</p>;
  return <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">{sales.map((sale) => <div className="flex items-center justify-between gap-4 px-4 py-4" key={sale.id}><div><p className="font-medium">{sale.items.map((item) => `${item.product.name} × ${item.quantity}`).join(", ")}</p><p className="text-xs text-muted-foreground">{sale.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p></div><span className="font-semibold">{formatMoney(sale.totalInCents)}</span></div>)}</div>;
}
