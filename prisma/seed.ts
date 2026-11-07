import "dotenv/config";
import { createAuthClient } from "@neondatabase/auth";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
if (!connectionString || !authBaseUrl) throw new Error("DATABASE_URL and NEON_AUTH_BASE_URL are required to seed the database.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const companyId = "cmjminiErpDemoCompany000001";
const demoEmail = process.env.DEMO_USER_EMAIL ?? "demo@mini-erp.local";
const demoPassword = process.env.DEMO_USER_PASSWORD ?? "";
if (!demoPassword) throw new Error("DEMO_USER_PASSWORD is required to seed the demo account.");

async function getDemoUserId() {
  const auth = createAuthClient(authBaseUrl!);
  const credentials = { email: demoEmail, password: demoPassword, name: "Demo User" };
  const signUp = await auth.signUp.email(credentials);
  if (!signUp.error && signUp.data?.user.id) return signUp.data.user.id;

  const signIn = await auth.signIn.email({ email: demoEmail, password: demoPassword });
  if (signIn.error || !signIn.data?.user.id) throw new Error(signIn.error?.message ?? "Could not create or sign in the demo user.");
  return signIn.data.user.id;
}

async function main() {
  const company = await prisma.company.upsert({ where: { id: companyId }, update: { name: "Demo Store" }, create: { id: companyId, name: "Demo Store" } });
  const userId = await getDemoUserId();
  await prisma.companyMember.upsert({ where: { companyId_userId: { companyId: company.id, userId } }, update: {}, create: { companyId: company.id, userId } });

  const products = [
    { sku: "COF-001", name: "Coffee beans", priceInCents: 3490, minStock: 10 },
    { sku: "MUG-001", name: "Ceramic mug", priceInCents: 2490, minStock: 8 },
    { sku: "TEA-001", name: "Black tea", priceInCents: 1590, minStock: 12 },
  ];
  const saved = [];
  for (const product of products) saved.push(await prisma.product.upsert({ where: { companyId_sku: { companyId: company.id, sku: product.sku } }, update: product, create: { ...product, companyId: company.id } }));
  await prisma.stockMovement.deleteMany({ where: { companyId: company.id } });
  await prisma.saleItem.deleteMany({ where: { sale: { companyId: company.id } } });
  await prisma.sale.deleteMany({ where: { companyId: company.id } });
  await prisma.product.deleteMany({ where: { companyId: company.id } });
  await prisma.stockMovement.createMany({ data: saved.map((product, index) => ({ companyId: company.id, productId: product.id, quantity: [45, 24, 60][index]!, type: "ENTRY" as const, note: "Initial demo stock" })) });
  const sale = await prisma.sale.create({ data: { companyId: company.id, totalInCents: saved[0]!.priceInCents * 3, items: { create: { productId: saved[0]!.id, quantity: 3, unitPriceInCents: saved[0]!.priceInCents } } }, select: { id: true } });
  await prisma.stockMovement.create({ data: { companyId: company.id, productId: saved[0]!.id, quantity: -3, type: "SALE", saleId: sale.id, note: "Demo sale" } });
  console.log(`Seeded ${company.name} with ${saved.length} products and demo account ${demoEmail}.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
