import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("combines class names properly", () => {
    const result = cn("text-red-500", false && "hidden", "bg-blue-500");
    expect(result).toBe("text-red-500 bg-blue-500");
  });
});
