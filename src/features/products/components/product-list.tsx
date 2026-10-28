"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deactivateProductAction } from "@/features/products/actions";

type Product = { id: string; name: string; sku: string; priceInCents: number; minStock: number };

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function ProductList({ products }: { products: Product[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function deactivate(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await deactivateProductAction({ id });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (products.length === 0) {
    return <p className="rounded-xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">No active products found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {error && <p role="alert" className="bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
      <div className="divide-y divide-border">
        {products.map((product) => (
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between" key={product.id}>
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">{product.sku} · {currency.format(product.priceInCents / 100)} · min. {product.minStock}</p>
            </div>
            <div className="flex gap-2">
              <Link className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted" href={`/app/products/${product.id}/edit`}>Edit</Link>
              <button className="rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-60" disabled={isPending} onClick={() => deactivate(product.id)} type="button">Deactivate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
