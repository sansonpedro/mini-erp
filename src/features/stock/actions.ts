"use server";

import { revalidatePath } from "next/cache";

import { getCompanyAccess } from "@/features/company/get-company-access";
import { stockMovementSchema } from "@/features/stock/schemas";
import { prisma } from "@/lib/prisma";
import { createStockMovementTransaction } from "@/features/stock/transactions";
import { NegativeStockError } from "@/features/stock/errors";

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
    await createStockMovementTransaction(prisma, access.company.id, product.id, validation.data);
  } catch (error) {
    if (error instanceof NegativeStockError) {
      return { error: "The adjustment cannot make stock negative." };
    }
    console.error("Failed to create stock movement", error);
    return { error: "We could not record this movement. Please try again." };
  }

  revalidatePath(`/app/${input.companyId}`);
  revalidatePath(`/app/${input.companyId}/stock`);
  return { success: true };
}
