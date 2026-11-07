import Link from "next/link";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { RecentProducts } from "@/features/dashboard/components/recent-products";
import { SetupChecklist } from "@/features/dashboard/components/setup-checklist";
import { formatMoney } from "@/lib/format-money";

type Dashboard = {
  activeProducts: number;
  inactiveProducts: number;
  todaySalesCount: number;
  todaySalesInCents: number;
  lowStockProducts: Array<{ id: string; name: string; sku: string; minStock: number }>;
  totalSales: number;
  recentMovements: Array<{ id: string; product: { name: string }; type: string; quantity: number }>;
  totalProducts: number;
  recentProducts: Array<{ id: string; name: string; sku: string; priceInCents: number; createdAt: Date }>;
};

export function DashboardContent({ companyId, companyName, dashboard }: { companyId: string; companyName: string; dashboard: Dashboard }) {
  return (
    <main className="flex-1 bg-muted/30 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div><p className="text-sm text-muted-foreground">Overview</p><h1 className="text-2xl font-semibold tracking-tight">Welcome to {companyName}</h1></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><MetricCard label="Active products" value={dashboard.activeProducts} /><MetricCard label="Inactive products" value={dashboard.inactiveProducts} /><MetricCard label="Sales today" value={dashboard.todaySalesCount} /><MetricCard label="Sales today value" value={formatMoney(dashboard.todaySalesInCents)} /></div>
        <div className="grid gap-4 lg:grid-cols-2"><MetricCard label="Low-stock products" value={dashboard.lowStockProducts.length} /><MetricCard label="Total sales" value={dashboard.totalSales} /></div>
        <section className="rounded-xl border border-border bg-background p-5"><div className="flex items-center justify-between gap-4"><h2 className="font-semibold">Low-stock products</h2><Link className="text-sm text-muted-foreground underline" href={"/app/" + companyId + "/stock"}>View stock</Link></div>{dashboard.lowStockProducts.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Everything is above its minimum stock.</p> : <div className="mt-4 divide-y divide-border">{dashboard.lowStockProducts.slice(0, 5).map((product) => <div className="flex items-center justify-between py-3 text-sm" key={product.id}><span>{product.name} <span className="text-muted-foreground">({product.sku})</span></span><span className="font-semibold text-destructive">At or below minimum</span></div>)}</div>}</section>
        <section className="rounded-xl border border-border bg-background p-5"><h2 className="font-semibold">Latest movements</h2>{dashboard.recentMovements.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No movements recorded yet.</p> : <div className="mt-3 divide-y divide-border">{dashboard.recentMovements.map((movement) => <div className="flex items-center justify-between py-3 text-sm" key={movement.id}><span>{movement.product.name} <span className="text-muted-foreground">· {movement.type.toLowerCase()}</span></span><span className={movement.quantity > 0 ? "font-semibold text-emerald-600" : "font-semibold text-destructive"}>{movement.quantity > 0 ? "+" : ""}{movement.quantity}</span></div>)}</div>}</section>
        <div className="grid gap-4 lg:grid-cols-2"><SetupChecklist hasProducts={dashboard.totalProducts > 0} /><RecentProducts companyId={companyId} products={dashboard.recentProducts} /></div>
      </div>
    </main>
  );
}
