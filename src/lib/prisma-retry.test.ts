import { describe, expect, it } from "vitest";

import { withSerializableRetry } from "@/lib/prisma-retry";

describe("withSerializableRetry", () => {
  it("retries serialization conflicts and succeeds", async () => {
    let calls = 0;
    const result = await withSerializableRetry(async () => {
      calls += 1;
      if (calls < 3) throw { code: "P2034" };
      return "ok";
    }, { baseDelayMs: 0 });

    expect(result).toBe("ok");
    expect(calls).toBe(3);
  });

  it("does not retry other errors", async () => {
    let calls = 0;
    await expect(withSerializableRetry(async () => {
      calls += 1;
      throw new Error("business rule");
    }, { baseDelayMs: 0 })).rejects.toThrow("business rule");
    expect(calls).toBe(1);
  });
});
