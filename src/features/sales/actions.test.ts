import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCompanyAccess: vi.fn(),
  findMany: vi.fn(),
  aggregate: vi.fn(),
  saleCreate: vi.fn(),
  movementCreateMany: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/features/company/get-company-access", () => ({ getCompanyAccess: mocks.getCompanyAccess }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { $transaction: mocks.transaction } }));

import { createSaleAction } from "@/features/sales/actions";

const productId = "cmj4p9gq0000001l5d2x4c3aa";

describe("createSaleAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCompanyAccess.mockResolvedValue({ user: { id: "user-a" }, company: { id: "company-a", name: "A" } });
    mocks.transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => callback({
      product: { findMany: mocks.findMany },
      stockMovement: { aggregate: mocks.aggregate, createMany: mocks.movementCreateMany },
      sale: { create: mocks.saleCreate },
    }));
    mocks.findMany.mockResolvedValue([{ id: productId, priceInCents: 1000, name: "Coffee" }]);
    mocks.saleCreate.mockResolvedValue({ id: "sale-a" });
  });

  it("rejects an oversized sale without creating sale or movement records", async () => {
    mocks.aggregate.mockResolvedValue({ _sum: { quantity: 1 } });

    const result = await createSaleAction({ companyId: "company-a", sale: { items: [{ productId, quantity: "2" }] } });

    expect(result).toEqual({ error: "Coffee does not have enough stock." });
    expect(mocks.saleCreate).not.toHaveBeenCalled();
    expect(mocks.movementCreateMany).not.toHaveBeenCalled();
  });

  it("creates outbound movements for a valid sale", async () => {
    mocks.aggregate.mockResolvedValue({ _sum: { quantity: 5 } });

    const result = await createSaleAction({ companyId: "company-a", sale: { items: [{ productId, quantity: "2" }] } });

    expect(result).toEqual({ success: true });
    expect(mocks.saleCreate).toHaveBeenCalledOnce();
    expect(mocks.movementCreateMany).toHaveBeenCalledWith({ data: [{ companyId: "company-a", productId, quantity: -2, type: "SALE", saleId: "sale-a" }] });
  });
});
