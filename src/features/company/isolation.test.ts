import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  findFirst: vi.fn(),
  notFound: vi.fn(() => { throw new Error("NOT_FOUND"); }),
  redirect: vi.fn(() => { throw new Error("REDIRECT"); }),
}));

vi.mock("@/lib/auth/server", () => ({ auth: { getSession: mocks.getSession } }));
vi.mock("@/lib/prisma", () => ({ prisma: { companyMember: { findFirst: mocks.findFirst } } }));
vi.mock("next/navigation", () => ({ notFound: mocks.notFound, redirect: mocks.redirect }));

import { getCompanyAccess } from "@/features/company/get-company-access";

describe("company isolation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("prevents a user from reading another company through the access boundary", async () => {
    mocks.getSession.mockResolvedValue({ data: { user: { id: "user-a" } } });
    mocks.findFirst.mockResolvedValue(null);

    await expect(getCompanyAccess("company-b")).rejects.toThrow("NOT_FOUND");
    expect(mocks.findFirst).toHaveBeenCalledWith({ where: { companyId: "company-b", userId: "user-a" }, include: { company: true } });
  });
});
