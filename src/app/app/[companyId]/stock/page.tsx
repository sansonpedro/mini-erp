import Link from "next/link";

import { getCompanyAccess } from "@/features/company/get-company-access";
import { StockMovementForm } from "@/features/stock/components/stock-movement-form";
import { getStockMovements, getStockOverview } from "@/features/stock/queries";

export const dynamic = "force-dynamic";

export default async function StockPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const access = await getCompanyAccess(companyId);
  const [products, movements] = await Promise.all([getStockOverview(access), getStockMovements(access)]);

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div>
            <Link className="text-sm text-muted-foreground underline underline-offset-4" href={`/app/${companyId}`}>Back to workspace</Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Stock</h1>
            <p className="mt-2 text-sm text-muted-foreground">Track current stock from its movement history.</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-border px-4 py-3 text-xs font-semibold uppercase text-muted-foreground"><span>Product</span><span>Stock</span><span>Minimum</span></div>
            {products.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Add an active product before recording stock.</p> : products.map((product) => <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-border px-4 py-4 last:border-0" key={product.id}><div><p className="font-medium">{product.name}</p><p className="text-sm text-muted-foreground">{product.sku}</p></div><span className={product.currentStock <= product.minStock ? "font-semibold text-destructive" : "font-semibold"}>{product.currentStock}</span><span className="text-muted-foreground">{product.minStock}</span></div>)}
          </div>
          <div className="space-y-3"><h2 className="text-xl font-semibold">Recent movements</h2>{movements.length === 0 ? <p className="rounded-xl border border-dashed border-border px-5 py-8 text-sm text-muted-foreground">No stock movements yet.</p> : <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">{movements.map((movement) => <div className="flex items-center justify-between gap-4 px-4 py-3" key={movement.id}><div><p className="font-medium">{movement.product.name}</p><p className="text-xs text-muted-foreground">{movement.type.toLowerCase()} · {movement.note || "No note"}</p></div><span className={movement.quantity > 0 ? "font-semibold text-emerald-600" : "font-semibold text-destructive"}>{movement.quantity > 0 ? "+" : ""}{movement.quantity}</span></div>)}</div>}</div>
        </section>
        <section className="h-fit rounded-2xl border border-border bg-background p-6 shadow-sm"><h2 className="text-xl font-semibold">Record stock</h2><p className="mb-6 mt-2 text-sm text-muted-foreground">Entries increase stock. Adjustments can increase or decrease it.</p><StockMovementForm companyId={companyId} products={products.map(({ id, name, sku }) => ({ id, name, sku }))} /></section>
      </div>
    </main>
  );
}
