import { describe, expect, it } from "vitest";
import { hasEnoughStock, mergeSaleItems } from "@/features/sales/rules";

describe("sales stock rules", () => {
  it("merges duplicate product lines", () => {
    expect(mergeSaleItems([{ productId: "a", quantity: 2 }, { productId: "a", quantity: 3 }])).toEqual([{ productId: "a", quantity: 5 }]);
  });

  it("rejects sales above available stock", () => {
    expect(hasEnoughStock(4, 5)).toBe(false);
    expect(hasEnoughStock(5, 5)).toBe(true);
  });
});
