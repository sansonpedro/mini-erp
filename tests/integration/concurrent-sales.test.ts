import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

import { createSaleTransaction } from "@/features/sales/transactions";

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
    try {
      const product = await prisma.product.create({ data: { companyId: company.id, name: "Single item", sku: `CON-${Date.now()}`, priceInCents: 100, minStock: 0 } });
      await prisma.stockMovement.create({ data: { companyId: company.id, productId: product.id, quantity: 1, type: "ENTRY" } });

      const sellOne = () => createSaleTransaction(prisma!, company.id, [{ productId: product.id, quantity: 1 }]);

      const results = await Promise.allSettled([sellOne(), sellOne()]);
      const fulfilled = results.filter((result) => result.status === "fulfilled");
      expect(fulfilled).toHaveLength(1);

      const finalStock = await prisma.stockMovement.aggregate({ where: { companyId: company.id, productId: product.id }, _sum: { quantity: true } });
      expect(finalStock._sum.quantity).toBe(0);
      expect(await prisma.sale.count({ where: { companyId: company.id } })).toBe(1);
    } finally {
      await prisma.saleItem.deleteMany({ where: { sale: { companyId: company.id } } });
      await prisma.sale.deleteMany({ where: { companyId: company.id } });
      await prisma.stockMovement.deleteMany({ where: { companyId: company.id } });
      await prisma.product.deleteMany({ where: { companyId: company.id } });
      await prisma.company.delete({ where: { id: company.id } });
    }
  });
});
