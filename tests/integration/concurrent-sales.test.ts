import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

import { withSerializableRetry } from "@/lib/prisma-retry";

const connectionString = process.env.DATABASE_URL_TEST;
const prisma = connectionString ? new PrismaClient({ adapter: new PrismaPg({ connectionString }) }) : null;

describe.skipIf(!connectionString)("concurrent sales with PostgreSQL", () => {
  beforeAll(async () => {
    if (!prisma) throw new Error("DATABASE_URL_TEST is required for integration tests.");
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma?.$disconnect();
  });

  it("does not allow two concurrent sales to make stock negative", async () => {
    if (!prisma) throw new Error("DATABASE_URL_TEST is required for integration tests.");
    const company = await prisma.company.create({ data: { name: "Concurrency test" } });
    const product = await prisma.product.create({ data: { companyId: company.id, name: "Single item", sku: `CON-${Date.now()}`, priceInCents: 100, minStock: 0 } });
    await prisma.stockMovement.create({ data: { companyId: company.id, productId: product.id, quantity: 1, type: "ENTRY" } });

    const sellOne = () => withSerializableRetry(() => prisma!.$transaction(async (tx) => {
      const stock = await tx.stockMovement.aggregate({ where: { companyId: company.id, productId: product.id }, _sum: { quantity: true } });
      if ((stock._sum.quantity ?? 0) < 1) throw new Error("INSUFFICIENT_STOCK");
      const sale = await tx.sale.create({ data: { companyId: company.id, totalInCents: 100, items: { create: { productId: product.id, quantity: 1, unitPriceInCents: 100 } } }, select: { id: true } });
      await tx.stockMovement.create({ data: { companyId: company.id, productId: product.id, quantity: -1, type: "SALE", saleId: sale.id } });
    }, { isolationLevel: "Serializable" }));

    const results = await Promise.allSettled([sellOne(), sellOne()]);
    const fulfilled = results.filter((result) => result.status === "fulfilled");
    expect(fulfilled).toHaveLength(1);

    const finalStock = await prisma.stockMovement.aggregate({ where: { companyId: company.id, productId: product.id }, _sum: { quantity: true } });
    expect(finalStock._sum.quantity).toBe(0);
    expect(await prisma.sale.count({ where: { companyId: company.id } })).toBe(1);
    await prisma.company.delete({ where: { id: company.id } });
  });
});
