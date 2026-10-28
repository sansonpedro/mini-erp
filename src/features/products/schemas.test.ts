import { describe, expect, it } from "vitest";

import { productSchema } from "@/features/products/schemas";

describe("productSchema", () => {
  it("accepts product values from form inputs", () => {
    expect(productSchema.parse({ name: "Coffee", sku: "COF-001", priceInCents: "1299", minStock: "5" })).toEqual({
      name: "Coffee",
      sku: "COF-001",
      priceInCents: 1299,
      minStock: 5,
    });
  });

  it("rejects negative money and stock values", () => {
    const result = productSchema.safeParse({ name: "Coffee", sku: "COF-001", priceInCents: "-1", minStock: "-2" });
    expect(result.success).toBe(false);
  });
});
