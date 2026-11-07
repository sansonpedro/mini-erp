import { describe, expect, it } from "vitest";
import { startOfTodayInSaoPaulo } from "@/lib/date";

describe("startOfTodayInSaoPaulo", () => {
  it("uses the Sao Paulo date near the UTC day boundary", () => {
    const result = startOfTodayInSaoPaulo(new Date("2026-11-08T00:30:00.000Z"));
    expect(result.toISOString()).toBe("2026-11-07T03:00:00.000Z");
  });
});
