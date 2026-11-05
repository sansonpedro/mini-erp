import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.string().cuid("Select a valid product."),
  quantity: z.coerce.number().int("Quantity must be a whole number.").positive("Quantity must be greater than zero."),
});

export const saleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "Add at least one product to the sale.").max(50, "A sale cannot contain more than 50 lines."),
});

export type SaleFormValues = z.input<typeof saleSchema>;
