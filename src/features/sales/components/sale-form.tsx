"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createSaleAction } from "@/features/sales/actions";
import { formatMoney } from "@/lib/format-money";

type Product = { id: string; name: string; sku: string; priceInCents: number; currentStock: number };

export function SaleForm({ companyId, products }: { companyId: string; products: Product[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([]);
  const selected = products.find((product) => product.id === productId);

  function addItem() {
    if (!selected) return;
    const amount = Number(quantity);
    if (!Number.isInteger(amount) || amount <= 0) { setError("Quantity must be greater than zero."); return; }
    setError(null);
    setItems((current) => current.some((item) => item.productId === productId) ? current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + amount } : item) : [...current, { productId, quantity: amount }]);
    setQuantity("1");
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await createSaleAction({ companyId, sale: { items } });
      if (result.error) { setError(result.error); return; }
      setItems([]); router.refresh();
    });
  }

  const total = items.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.priceInCents ?? 0) * item.quantity, 0);
  return <div className="space-y-4">
    <div><label className="text-sm font-medium" htmlFor="sale-product">Product</label><select id="sale-product" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" value={productId} onChange={(event) => setProductId(event.target.value)}><option value="">Select a product</option>{products.filter((product) => product.currentStock > 0).map((product) => <option key={product.id} value={product.id}>{product.name} ({product.currentStock} in stock)</option>)}</select></div>
    <div className="flex gap-2"><input className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm" type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /><button className="rounded-lg border px-4 text-sm font-medium" type="button" onClick={addItem}>Add</button></div>
    {items.length > 0 && <div className="divide-y rounded-lg border">{items.map((item) => { const product = products.find((candidate) => candidate.id === item.productId)!; return <div className="flex items-center justify-between gap-3 px-3 py-2 text-sm" key={item.productId}><span>{product.name} × {item.quantity}</span><span>{formatMoney(product.priceInCents * item.quantity)}</span></div>; })}<div className="flex justify-between px-3 py-3 font-semibold"><span>Total</span><span>{formatMoney(total)}</span></div></div>}
    {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
    <button className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60" disabled={isPending || items.length === 0} type="button" onClick={submit}>{isPending ? "Recording…" : "Record sale"}</button>
  </div>;
}
