"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createStockMovementAction } from "@/features/stock/actions";

type Product = { id: string; name: string; sku: string };

export function StockMovementForm({ companyId, products }: { companyId: string; products: Product[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"ENTRY" | "ADJUSTMENT">("ENTRY");

  function submit(formData: FormData) {
    setError(null);
    const movement = {
      productId: String(formData.get("productId") ?? ""),
      type,
      quantity: String(formData.get("quantity") ?? ""),
      note: String(formData.get("note") ?? ""),
    };
    startTransition(async () => {
      const result = await createStockMovementAction({ companyId, movement });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
      (document.querySelector("form[data-stock-form]") as HTMLFormElement | null)?.reset();
    });
  }

  const inputClassName = "mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  return (
    <form data-stock-form action={submit} className="space-y-4">
      <div>
        <label className="text-sm font-medium" htmlFor="stock-product">Product</label>
        <select id="stock-product" name="productId" className={inputClassName} required>
          <option value="">Select a product</option>
          {products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="stock-type">Movement type</label>
        <select id="stock-type" className={inputClassName} value={type} onChange={(event) => setType(event.target.value as "ENTRY" | "ADJUSTMENT")}>
          <option value="ENTRY">Stock entry</option>
          <option value="ADJUSTMENT">Adjustment (+ or -)</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="stock-quantity">Quantity</label>
        <input id="stock-quantity" name="quantity" className={inputClassName} type="number" step="1" required placeholder={type === "ADJUSTMENT" ? "e.g. -2 or 5" : "e.g. 10"} />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="stock-note">Note (optional)</label>
        <input id="stock-note" name="note" className={inputClassName} maxLength={200} />
      </div>
      {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      <button className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60" disabled={isPending || products.length === 0} type="submit">{isPending ? "Saving…" : "Record movement"}</button>
    </form>
  );
}
