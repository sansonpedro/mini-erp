"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSaleAction } from "@/features/sales/actions";
import { saleSchema } from "@/features/sales/schemas";
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
    const nextItems = items.some((item) => item.productId === productId) ? items.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + amount } : item) : [...items, { productId, quantity: amount }];
    const validation = saleSchema.safeParse({ items: nextItems });
    if (!validation.success) { setError(validation.error.issues[0]?.message ?? "Enter valid sale details."); return; }
    setError(null);
    setItems(nextItems);
    setQuantity("1");
  }

  function submit() {
    const validation = saleSchema.safeParse({ items });
    if (!validation.success) { setError(validation.error.issues[0]?.message ?? "Enter valid sale details."); return; }
    setError(null);
    startTransition(async () => {
      const result = await createSaleAction({ companyId, sale: validation.data });
      if (result.error) { setError(result.error); return; }
      setItems([]);
      router.refresh();
    });
  }

  const total = items.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.priceInCents ?? 0) * item.quantity, 0);
  return <div className="space-y-4">
    <div><label className="text-sm font-medium" htmlFor="sale-product">Product</label><select id="sale-product" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" value={productId} onChange={(event) => setProductId(event.target.value)}><option value="">Select a product</option>{products.filter((product) => product.currentStock > 0).map((product) => <option key={product.id} value={product.id}>{product.name} ({product.currentStock} in stock)</option>)}</select></div>
    <div className="flex gap-2"><Input className="h-11 min-w-0 flex-1" type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /><Button variant="outline" type="button" onClick={addItem}>Add</Button></div>
    {items.length > 0 && <div className="divide-y rounded-lg border">{items.map((item) => { const product = products.find((candidate) => candidate.id === item.productId)!; return <div className="flex items-center justify-between gap-3 px-3 py-2 text-sm" key={item.productId}><span>{product.name} x {item.quantity}</span><span>{formatMoney(product.priceInCents * item.quantity)}</span></div>; })}<div className="flex justify-between px-3 py-3 font-semibold"><span>Total</span><span>{formatMoney(total)}</span></div></div>}
    {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
    <Button className="h-11 w-full" disabled={isPending || items.length === 0} type="button" onClick={submit}>{isPending ? "Recording..." : "Record sale"}</Button>
  </div>;
}
