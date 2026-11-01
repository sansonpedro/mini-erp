import { describe, expect, it } from "vitest";

import { parseEnv } from "@/lib/env";

const validEnv = {
  DATABASE_URL: "postgresql://user:password@localhost:5432/app?sslmode=verify-full",
  DATABASE_URL_UNPOOLED: "postgresql://user:password@localhost:5432/app?sslmode=verify-full",
  NEON_AUTH_BASE_URL: "https://auth.example.com",
  NEON_AUTH_COOKIE_SECRET: "a-secret-with-at-least-thirty-two-characters",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
};

describe("parseEnv", () => {
  it("returns a typed environment for valid values", () => {
    expect(parseEnv(validEnv)).toMatchObject(validEnv);
  });

  it("rejects invalid URLs and short secrets", () => {
    expect(() =>
      parseEnv({
        ...validEnv,
        DATABASE_URL: "not-a-url",
        NEON_AUTH_COOKIE_SECRET: "short",
      }),
    ).toThrow();
  });
});
