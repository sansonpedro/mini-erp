import type { PrismaClient } from "@/generated/prisma/client";
import { mergeSaleItems, hasEnoughStock } from "@/features/sales/rules";
import { ProductNotFoundError, InsufficientStockError, SaleTotalOverflowError } from "@/features/sales/errors";
import { withSerializableRetry } from "@/lib/prisma-retry";

type Db = PrismaClient;

export async function createSaleTransaction(db: Db, companyId: string, input: { productId: string; quantity: number }[]) {
  const items = mergeSaleItems(input);
  return withSerializableRetry(() => db.$transaction(async (tx) => {
    const products = await tx.product.findMany({ where: { companyId, active: true, id: { in: items.map((item) => item.productId) } }, select: { id: true, priceInCents: true, name: true } });
    if (products.length !== items.length) throw new ProductNotFoundError();
    let totalInCents = 0;
    for (const item of items) {
      const product = products.find((candidate) => candidate.id === item.productId)!;
      const stock = await tx.stockMovement.aggregate({ where: { companyId, productId: item.productId }, _sum: { quantity: true } });
      if (!hasEnoughStock(stock._sum.quantity ?? 0, item.quantity)) throw new InsufficientStockError(product.name);
      totalInCents += product.priceInCents * item.quantity;
      if (totalInCents > 2_147_483_647) throw new SaleTotalOverflowError();
    }
    const sale = await tx.sale.create({ data: { companyId, totalInCents, items: { create: items.map((item) => ({ productId: item.productId, quantity: item.quantity, unitPriceInCents: products.find((product) => product.id === item.productId)!.priceInCents })) } }, select: { id: true } });
    await tx.stockMovement.createMany({ data: items.map((item) => ({ companyId, productId: item.productId, quantity: -item.quantity, type: "SALE" as const, saleId: sale.id })) });
  }, { isolationLevel: "Serializable" }));
}
