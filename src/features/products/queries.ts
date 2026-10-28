import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentCompany() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  return prisma.companyMember.findUnique({
    where: { userId: session.user.id },
    select: { companyId: true },
  });
}

export async function getProducts(search?: string) {
  const membership = await getCurrentCompany();
  if (!membership) return [];

  const normalizedSearch = search?.trim();
  return prisma.product.findMany({
    where: {
      companyId: membership.companyId,
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

export async function getProductById(id: string) {
  const membership = await getCurrentCompany();
  if (!membership) return null;

  return prisma.product.findFirst({
    where: { id, companyId: membership.companyId, active: true },
  });
}
