import type { PrismaClient } from "@/generated/prisma/client";
import { NegativeStockError } from "@/features/stock/errors";
import { withSerializableRetry } from "@/lib/prisma-retry";

export async function createStockMovementTransaction(db: PrismaClient, companyId: string, productId: string, input: { type: "ENTRY" | "ADJUSTMENT"; quantity: number; note?: string }) {
  return withSerializableRetry(() => db.$transaction(async (tx) => {
    if (input.type === "ADJUSTMENT" && input.quantity < 0) {
      const stock = await tx.stockMovement.aggregate({ where: { companyId, productId }, _sum: { quantity: true } });
      if ((stock._sum.quantity ?? 0) + input.quantity < 0) throw new NegativeStockError();
    }
    return tx.stockMovement.create({ data: { companyId, productId, quantity: input.quantity, type: input.type, note: input.note || null } });
  }, { isolationLevel: "Serializable" }));
}
