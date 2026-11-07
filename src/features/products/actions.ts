"use server";

import { revalidatePath } from "next/cache";

import { productIdSchema, productSchema } from "@/features/products/schemas";
import { getCompanyAccess } from "@/features/company/get-company-access";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { rateLimitAction } from "@/lib/rate-limit";

type ActionResult = { error?: string; success?: true };

export async function createProductAction(input: { companyId: string; product: unknown }): Promise<ActionResult> {
  const validation = productSchema.safeParse(input.product);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? "Enter valid product details." };
  }

  const access = await getCompanyAccess(input.companyId);
  if (!(await rateLimitAction(access.user.id, { namespace: "products", limit: 60, windowMs: 60_000 })).allowed) {
    return { error: "Too many product attempts. Please try again later." };
  }

  try {
    await prisma.product.create({ data: { ...validation.data, companyId: access.company.id } });
  } catch (error) {
    if (isUniqueConstraintError(error)) return { error: "That SKU is already in use in your company." };
    console.error("Failed to create product", error);
    return { error: "We could not create the product. Please try again." };
  }

  revalidatePath(`/app/${input.companyId}/products`);
  return { success: true };
}

export async function updateProductAction(input: { companyId: string; id: unknown; product: unknown }): Promise<ActionResult> {
  const parsedInput = parseProductUpdateInput(input);
  if (!parsedInput.success) return { error: parsedInput.error };

  const access = await getCompanyAccess(input.companyId);
  if (!(await rateLimitAction(access.user.id, { namespace: "products", limit: 60, windowMs: 60_000 })).allowed) {
    return { error: "Too many product attempts. Please try again later." };
  }

  try {
    const result = await prisma.product.updateMany({
      where: { id: parsedInput.data.id, companyId: input.companyId, active: true },
      data: parsedInput.data.product,
    });
    if (result.count === 0) return { error: "Product not found." };
  } catch (error) {
    if (isUniqueConstraintError(error)) return { error: "That SKU is already in use in your company." };
    console.error("Failed to update product", error);
    return { error: "We could not update the product. Please try again." };
  }

  revalidatePath(`/app/${input.companyId}/products`);
  revalidatePath(`/app/${input.companyId}/products/${parsedInput.data.id}/edit`);
  return { success: true };
}

function isUniqueConstraintError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function parseProductUpdateInput(input: unknown) {
  if (!input || typeof input !== "object") return { success: false as const, error: "Enter valid product details." };
  const candidate = input as { id?: unknown; product?: unknown };
  const id = productIdSchema.safeParse({ id: candidate.id });
  const product = productSchema.safeParse(candidate.product);
  if (!id.success) return { success: false as const, error: "Product not found." };
  if (!product.success) return { success: false as const, error: product.error.issues[0]?.message ?? "Enter valid product details." };
  return { success: true as const, data: { id: id.data.id, product: product.data } };
}

export async function deactivateProductAction(input: { companyId: string; id: unknown }): Promise<ActionResult> {
  const validation = productIdSchema.safeParse(input);
  if (!validation.success) return { error: "Product not found." };

  const access = await getCompanyAccess(input.companyId);
  if (!(await rateLimitAction(access.user.id, { namespace: "products", limit: 60, windowMs: 60_000 })).allowed) {
    return { error: "Too many product attempts. Please try again later." };
  }

  const result = await prisma.product.updateMany({
    where: { id: validation.data.id, companyId: input.companyId, active: true },
    data: { active: false },
  });
  if (result.count === 0) return { error: "Product not found." };

  revalidatePath(`/app/${input.companyId}/products`);
  revalidatePath(`/app/${input.companyId}/products/${validation.data.id}/edit`);
  return { success: true };
}
