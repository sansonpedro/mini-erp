import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/features/products/components/product-form";
import { getProductById } from "@/features/products/queries";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-sm">
        <Link className="text-sm text-muted-foreground underline underline-offset-4" href="/app/products">Back to products</Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Edit product</h1>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">Update the product details below.</p>
        <ProductForm product={product} />
      </section>
    </main>
  );
}
