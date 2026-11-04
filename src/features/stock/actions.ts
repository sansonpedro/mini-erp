"use server";

import { revalidatePath } from "next/cache";

import { getCompanyAccess } from "@/features/company/get-company-access";
import { stockMovementSchema } from "@/features/stock/schemas";
import { prisma } from "@/lib/prisma";

type ActionResult = { error?: string; success?: true };

export async function createStockMovementAction(input: { companyId: string; movement: unknown }): Promise<ActionResult> {
  const validation = stockMovementSchema.safeParse(input.movement);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? "Enter valid stock movement details." };
  }

  const access = await getCompanyAccess(input.companyId);
  const product = await prisma.product.findFirst({
    where: { id: validation.data.productId, companyId: access.company.id, active: true },
    select: { id: true },
  });
  if (!product) return { error: "Product not found." };

  try {
    await prisma.$transaction(async (tx) => {
      if (validation.data.type === "ADJUSTMENT" && validation.data.quantity < 0) {
        const stock = await tx.stockMovement.aggregate({
          where: { companyId: access.company.id, productId: product.id },
          _sum: { quantity: true },
        });
        const currentStock = stock._sum.quantity ?? 0;
        if (currentStock + validation.data.quantity < 0) {
          throw new Error("NEGATIVE_STOCK");
        }
      }

      await tx.stockMovement.create({
        data: {
          companyId: access.company.id,
          productId: product.id,
          quantity: validation.data.quantity,
          type: validation.data.type,
          note: validation.data.note || null,
        },
      });
    }, { isolationLevel: "Serializable" });
  } catch (error) {
    if (error instanceof Error && error.message === "NEGATIVE_STOCK") {
      return { error: "The adjustment cannot make stock negative." };
    }
    return { error: "We could not record this movement. Please try again." };
  }

  revalidatePath(`/app/${input.companyId}`);
  revalidatePath(`/app/${input.companyId}/stock`);
  return { success: true };
}
