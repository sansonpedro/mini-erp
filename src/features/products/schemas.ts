import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Enter a product name.").max(120, "Product name is too long."),
  sku: z.string().trim().min(1, "Enter an SKU.").max(50, "SKU must be 50 characters or fewer."),
  priceInCents: z.coerce.number().int("Price must be a whole number.").min(0).max(2_147_483_647, "Price is too high."),
  minStock: z.coerce.number().int("Minimum stock must be a whole number.").min(0).max(2_147_483_647, "Minimum stock is too high."),
});

export const productIdSchema = z.object({ id: z.string().min(1) });

export type ProductFormValues = z.input<typeof productSchema>;
export type ProductData = z.output<typeof productSchema>;
