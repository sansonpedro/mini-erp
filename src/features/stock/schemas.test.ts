import { describe, expect, it } from "vitest";

import { stockMovementSchema } from "@/features/stock/schemas";

describe("stockMovementSchema", () => {
  it("accepts a positive stock entry", () => {
    expect(stockMovementSchema.parse({ productId: "cmj4p9gq0000001l5d2x4c3aa", type: "ENTRY", quantity: "10" })).toMatchObject({
      type: "ENTRY",
      quantity: 10,
    });
  });

  it("accepts positive and negative adjustments", () => {
    expect(stockMovementSchema.safeParse({ productId: "cmj4p9gq0000001l5d2x4c3aa", type: "ADJUSTMENT", quantity: "-2" }).success).toBe(true);
    expect(stockMovementSchema.safeParse({ productId: "cmj4p9gq0000001l5d2x4c3aa", type: "ADJUSTMENT", quantity: "5" }).success).toBe(true);
  });

  it("rejects zero movements and non-positive entries", () => {
    expect(stockMovementSchema.safeParse({ productId: "cmj4p9gq0000001l5d2x4c3aa", type: "ENTRY", quantity: "0" }).success).toBe(false);
    expect(stockMovementSchema.safeParse({ productId: "cmj4p9gq0000001l5d2x4c3aa", type: "ADJUSTMENT", quantity: "0" }).success).toBe(false);
  });
});
