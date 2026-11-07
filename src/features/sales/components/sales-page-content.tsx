import Link from "next/link";
import { SaleForm } from "@/features/sales/components/sale-form";
import { SaleList } from "@/features/sales/components/sale-list";

type Sale = React.ComponentProps<typeof SaleList>["sales"][number];
type Product = React.ComponentProps<typeof SaleForm>["products"][number];

export function SalesPageContent({ companyId, sales, products }: { companyId: string; sales: Sale[]; products: Product[] }) {
  return <main className="min-h-screen bg-muted/30 px-6 py-12"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"><section className="space-y-5"><div><Link className="text-sm text-muted-foreground underline underline-offset-4" href={"/app/" + companyId}>Back to workspace</Link><h1 className="mt-3 text-3xl font-bold tracking-tight">Sales</h1><p className="mt-2 text-sm text-muted-foreground">Record outbound sales and keep stock accurate.</p></div><SaleList sales={sales} /></section><section className="h-fit rounded-2xl border border-border bg-background p-6 shadow-sm"><h2 className="text-xl font-semibold">Record sale</h2><p className="mb-6 mt-2 text-sm text-muted-foreground">Only products with available stock can be sold.</p><SaleForm companyId={companyId} products={products} /></section></div></main>;
}
