import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCompanyAccess: vi.fn(),
  aggregate: vi.fn(),
  create: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/features/company/get-company-access", () => ({ getCompanyAccess: mocks.getCompanyAccess }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: { findFirst: vi.fn().mockResolvedValue({ id: "cmj4p9gq0000001l5d2x4c3aa" }) },
    $transaction: mocks.transaction,
  },
}));

import { createStockMovementAction } from "@/features/stock/actions";

describe("createStockMovementAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCompanyAccess.mockResolvedValue({ user: { id: "user-a" }, company: { id: "company-a", name: "A" } });
    mocks.transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback({ stockMovement: { aggregate: mocks.aggregate, create: mocks.create } }));
  });

  it("rejects an adjustment that would make stock negative", async () => {
    mocks.aggregate.mockResolvedValue({ _sum: { quantity: 2 } });

    const result = await createStockMovementAction({ companyId: "company-a", movement: { productId: "cmj4p9gq0000001l5d2x4c3aa", type: "ADJUSTMENT", quantity: "-3" } });

    expect(result).toEqual({ error: "The adjustment cannot make stock negative." });
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
