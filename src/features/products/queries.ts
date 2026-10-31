import { prisma } from "@/lib/prisma";

export async function getProducts(companyId: string, search?: string) {
  const normalizedSearch = search?.trim();

  return prisma.product.findMany({
    where: {
      companyId,
      active: true,
      ...(normalizedSearch
        ? {
            OR: [
              { name: { contains: normalizedSearch, mode: "insensitive" } },
              { sku: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function getProductById(companyId: string, id: string) {
  return prisma.product.findFirst({
    where: { id, companyId, active: true },
  });
}
