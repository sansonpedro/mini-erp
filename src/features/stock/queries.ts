import { prisma } from "@/lib/prisma";

export async function getStockOverview(companyId: string) {
  const products = await prisma.product.findMany({
    where: { companyId, active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      sku: true,
      minStock: true,
      stockMovements: { select: { quantity: true } },
    },
  });

  return products.map(({ stockMovements, ...product }) => ({
    ...product,
    currentStock: stockMovements.reduce((total, movement) => total + movement.quantity, 0),
  }));
}

export async function getStockMovements(companyId: string) {
  return prisma.stockMovement.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { product: { select: { name: true, sku: true } } },
  });
}
