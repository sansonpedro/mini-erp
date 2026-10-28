import Link from "next/link";
import { redirect } from "next/navigation";

import { ProductForm } from "@/features/products/components/product-form";
import { ProductList } from "@/features/products/components/product-list";
import { getCurrentCompany, getProducts } from "@/features/products/queries";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const company = await getCurrentCompany();
  if (!company) redirect("/onboarding/company");

  const params = await searchParams;
  const products = await getProducts(params.q);

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div>
            <Link className="text-sm text-muted-foreground underline underline-offset-4" href="/app">Back to workspace</Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Products</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage your active product catalog.</p>
          </div>
          <form className="flex gap-2" method="get">
            <input className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue={params.q ?? ""} name="q" placeholder="Search by name or SKU" />
            <button className="rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted" type="submit">Search</button>
          </form>
          <ProductList products={products} />
        </section>
        <section className="h-fit rounded-2xl border border-border bg-background p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Add product</h2>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">Prices are stored as integer cents.</p>
          <ProductForm />
        </section>
      </div>
    </main>
  );
}
