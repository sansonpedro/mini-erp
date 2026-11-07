"use server";

import { revalidatePath } from "next/cache";

import { getCompanyAccess } from "@/features/company/get-company-access";
import { saleSchema } from "@/features/sales/schemas";
import { prisma } from "@/lib/prisma";
import { createSaleTransaction } from "@/features/sales/transactions";
import { ProductNotFoundError, InsufficientStockError, SaleTotalOverflowError } from "@/features/sales/errors";

type ActionResult = { error?: string; success?: true };

export async function createSaleAction(input: { companyId: string; sale: unknown }): Promise<ActionResult> {
  const validation = saleSchema.safeParse(input.sale);
  if (!validation.success) return { error: validation.error.issues[0]?.message ?? "Enter valid sale details." };

  const access = await getCompanyAccess(input.companyId);

  try {
    await createSaleTransaction(prisma, access.company.id, validation.data.items);
  } catch (error) {
    if (error instanceof ProductNotFoundError) return { error: "One or more products are unavailable." };
    if (error instanceof InsufficientStockError) return { error: `${error.productName} does not have enough stock.` };
    if (error instanceof SaleTotalOverflowError) return { error: "The sale total is too high." };
    console.error("Failed to create sale", error);
    return { error: "We could not record this sale. Please try again." };
  }

  revalidatePath(`/app/${input.companyId}`);
  revalidatePath(`/app/${input.companyId}/stock`);
  revalidatePath(`/app/${input.companyId}/sales`);
  return { success: true };
}
