import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Enter a product name."),
  sku: z.string().trim().min(1, "Enter an SKU.").max(50, "SKU must be 50 characters or fewer."),
  priceInCents: z.coerce.number().int("Price must be a whole number.").nonnegative("Price cannot be negative."),
  minStock: z.coerce.number().int("Minimum stock must be a whole number.").nonnegative("Minimum stock cannot be negative."),
});

export const productIdSchema = z.object({ id: z.string().min(1) });

export type ProductFormValues = z.input<typeof productSchema>;
export type ProductData = z.output<typeof productSchema>;
