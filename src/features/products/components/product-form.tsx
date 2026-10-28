"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { createProductAction, updateProductAction } from "@/features/products/actions";
import { productSchema, type ProductFormValues } from "@/features/products/schemas";

type ExistingProduct = { id: string; name: string; sku: string; priceInCents: number; minStock: number };

export function ProductForm({ product }: { product?: ExistingProduct }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setError, formState: { errors } } = useForm<ProductFormValues>({
    defaultValues: product ?? { name: "", sku: "", priceInCents: 0, minStock: 0 },
  });

  function onSubmit(values: ProductFormValues) {
    const validation = productSchema.safeParse(values);
    if (!validation.success) {
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (field === "name" || field === "sku" || field === "priceInCents" || field === "minStock") {
          setError(field, { message: issue.message });
        }
      }
      return;
    }

    startTransition(async () => {
      const result = product
        ? await updateProductAction({ id: product.id, product: validation.data })
        : await createProductAction(validation.data);
      if (result.error) {
        setError("root.server", { message: result.error });
        return;
      }
      router.push("/app/products");
      router.refresh();
    });
  }

  const inputClassName = "mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="text-sm font-medium" htmlFor="product-name">Name</label>
        <input id="product-name" className={inputClassName} {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="product-sku">SKU</label>
        <input id="product-sku" className={inputClassName} {...register("sku")} />
        {errors.sku && <p className="mt-1 text-xs text-destructive">{errors.sku.message}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium" htmlFor="product-price">Price (cents)</label>
          <input id="product-price" type="number" min="0" step="1" className={inputClassName} {...register("priceInCents")} />
          {errors.priceInCents && <p className="mt-1 text-xs text-destructive">{errors.priceInCents.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="product-min-stock">Minimum stock</label>
          <input id="product-min-stock" type="number" min="0" step="1" className={inputClassName} {...register("minStock")} />
          {errors.minStock && <p className="mt-1 text-xs text-destructive">{errors.minStock.message}</p>}
        </div>
      </div>
      {errors.root?.server && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{errors.root.server.message}</p>}
      <button className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Saving…" : product ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}
