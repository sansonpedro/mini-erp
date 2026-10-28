"use server";

import { revalidatePath } from "next/cache";

import { productIdSchema, productSchema } from "@/features/products/schemas";
import { getCurrentCompany } from "@/features/products/queries";
import { prisma } from "@/lib/prisma";

type ActionResult = { error?: string; success?: true };

export async function createProductAction(input: unknown): Promise<ActionResult> {
  const validation = productSchema.safeParse(input);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? "Enter valid product details." };
  }

  const membership = await getCurrentCompany();
  if (!membership) return { error: "You need a company before adding products." };

  try {
    await prisma.product.create({ data: { ...validation.data, companyId: membership.companyId } });
  } catch {
    return { error: "That SKU is already in use in your company." };
  }

  revalidatePath("/app/products");
  return { success: true };
}

export async function updateProductAction(input: unknown): Promise<ActionResult> {
  const parsedInput = parseProductUpdateInput(input);
  if (!parsedInput.success) return { error: parsedInput.error };

  const membership = await getCurrentCompany();
  if (!membership) return { error: "You need a company before editing products." };

  try {
    const result = await prisma.product.updateMany({
      where: { id: parsedInput.data.id, companyId: membership.companyId, active: true },
      data: parsedInput.data.product,
    });
    if (result.count === 0) return { error: "Product not found." };
  } catch {
    return { error: "That SKU is already in use in your company." };
  }

  revalidatePath("/app/products");
  revalidatePath(`/app/products/${parsedInput.data.id}/edit`);
  return { success: true };
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

export async function deactivateProductAction(input: unknown): Promise<ActionResult> {
  const validation = productIdSchema.safeParse(input);
  if (!validation.success) return { error: "Product not found." };

  const membership = await getCurrentCompany();
  if (!membership) return { error: "You need a company before editing products." };

  const result = await prisma.product.updateMany({
    where: { id: validation.data.id, companyId: membership.companyId, active: true },
    data: { active: false },
  });
  if (result.count === 0) return { error: "Product not found." };

  revalidatePath("/app/products");
  revalidatePath(`/app/products/${validation.data.id}/edit`);
  return { success: true };
}
