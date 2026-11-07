import { z } from "zod";

export const stockMovementSchema = z.object({
  productId: z.string().cuid("Select a valid product."),
  type: z.enum(["ENTRY", "ADJUSTMENT"]),
  quantity: z.coerce.number().int("Quantity must be a whole number.").min(-2_147_483_648).max(2_147_483_647),
  note: z.string().trim().max(200, "Note is too long.").optional(),
}).superRefine((value, context) => {
  if (value.type === "ENTRY" && value.quantity <= 0) {
    context.addIssue({ code: "custom", path: ["quantity"], message: "An entry must be greater than zero." });
  }
  if (value.type === "ADJUSTMENT" && value.quantity === 0) {
    context.addIssue({ code: "custom", path: ["quantity"], message: "An adjustment cannot be zero." });
  }
});

export type StockMovementFormValues = z.input<typeof stockMovementSchema>;
