"use server";

import { revalidatePath } from "next/cache";

import { getCompanyAccess } from "@/features/company/get-company-access";
import { mergeSaleItems, hasEnoughStock } from "@/features/sales/rules";
import { saleSchema } from "@/features/sales/schemas";
import { prisma } from "@/lib/prisma";

type ActionResult = { error?: string; success?: true };

export async function createSaleAction(input: { companyId: string; sale: unknown }): Promise<ActionResult> {
  const validation = saleSchema.safeParse(input.sale);
  if (!validation.success) return { error: validation.error.issues[0]?.message ?? "Enter valid sale details." };

  const access = await getCompanyAccess(input.companyId);
  const items = mergeSaleItems(validation.data.items);

  try {
    await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { companyId: access.company.id, active: true, id: { in: items.map((item) => item.productId) } },
        select: { id: true, priceInCents: true, name: true },
      });
      if (products.length !== items.length) throw new Error("PRODUCT_NOT_FOUND");

      for (const item of items) {
        const stock = await tx.stockMovement.aggregate({
          where: { companyId: access.company.id, productId: item.productId },
          _sum: { quantity: true },
        });
        if (!hasEnoughStock(stock._sum.quantity ?? 0, item.quantity)) {
          const product = products.find((candidate) => candidate.id === item.productId);
          throw new Error(`INSUFFICIENT_STOCK:${product?.name ?? "product"}`);
        }
      }

      const totalInCents = items.reduce((total, item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        return total + (product?.priceInCents ?? 0) * item.quantity;
      }, 0);

      const sale = await tx.sale.create({
        data: {
          companyId: access.company.id,
          totalInCents,
          items: { create: items.map((item) => ({ productId: item.productId, quantity: item.quantity, unitPriceInCents: products.find((product) => product.id === item.productId)!.priceInCents })) },
        },
        select: { id: true },
      });

      await tx.stockMovement.createMany({
        data: items.map((item) => ({ companyId: access.company.id, productId: item.productId, quantity: -item.quantity, type: "SALE" as const, saleId: sale.id })),
      });
    }, { isolationLevel: "Serializable" });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") return { error: "One or more products are unavailable." };
    if (error instanceof Error && error.message.startsWith("INSUFFICIENT_STOCK:")) return { error: `${error.message.slice("INSUFFICIENT_STOCK:".length)} does not have enough stock.` };
    return { error: "We could not record this sale. Please try again." };
  }

  revalidatePath(`/app/${input.companyId}`);
  revalidatePath(`/app/${input.companyId}/stock`);
  revalidatePath(`/app/${input.companyId}/sales`);
  return { success: true };
}
