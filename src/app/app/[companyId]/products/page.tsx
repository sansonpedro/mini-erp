import Link from "next/link";

import { ProductForm } from "@/features/products/components/product-form";
import { ProductList } from "@/features/products/components/product-list";
import { getCompanyAccess } from "@/features/company/get-company-access";
import { getProducts } from "@/features/products/queries";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ params, searchParams }: { params: Promise<{ companyId: string }>; searchParams: Promise<{ q?: string }> }) {
  const { companyId } = await params;
  const access = await getCompanyAccess(companyId);

  const query = await searchParams;
  const products = await getProducts(access, query.q);

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div>
            <Link className="text-sm text-muted-foreground underline underline-offset-4" href={`/app/${companyId}`}>Back to workspace</Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Products</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage your active product catalog.</p>
          </div>
          <form className="flex gap-2" method="get">
            <input className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue={query.q ?? ""} name="q" placeholder="Search by name or SKU" />
            <button className="rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted" type="submit">Search</button>
          </form>
          <ProductList companyId={companyId} products={products} />
        </section>
        <section className="h-fit rounded-2xl border border-border bg-background p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Add product</h2>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">Prices are stored as integer cents.</p>
          <ProductForm companyId={companyId} />
        </section>
      </div>
    </main>
  );
}
