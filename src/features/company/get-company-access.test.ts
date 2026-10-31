import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  findFirst: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));

vi.mock("@/lib/auth/server", () => ({ auth: { getSession: mocks.getSession } }));
vi.mock("@/lib/prisma", () => ({ prisma: { companyMember: { findFirst: mocks.findFirst } } }));
vi.mock("next/navigation", () => ({ notFound: mocks.notFound, redirect: mocks.redirect }));

import { getCompanyAccess } from "@/features/company/get-company-access";

describe("getCompanyAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the user and company for a member", async () => {
    const user = { id: "user-1", name: "Alex", email: "alex@example.com" };
    const company = { id: "company-1", name: "Acme", createdAt: new Date() };
    mocks.getSession.mockResolvedValue({ data: { user } });
    mocks.findFirst.mockResolvedValue({ company });

    await expect(getCompanyAccess("company-1")).resolves.toEqual({ user, company });
    expect(mocks.findFirst).toHaveBeenCalledWith({
      where: { companyId: "company-1", userId: "user-1" },
      include: { company: true },
    });
  });

  it("blocks a non-member", async () => {
    mocks.getSession.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mocks.findFirst.mockResolvedValue(null);

    await expect(getCompanyAccess("company-2")).rejects.toThrow("NOT_FOUND");
    expect(mocks.notFound).toHaveBeenCalledOnce();
  });
});
