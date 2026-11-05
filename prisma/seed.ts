import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to seed the database.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const companyId = "cmjminiWmsDemoCompany000001";

async function main() {
  const company = await prisma.company.upsert({ where: { id: companyId }, update: { name: "Demo Store" }, create: { id: companyId, name: "Demo Store" } });
  const userId = process.env.DEMO_USER_ID;
  if (userId) await prisma.companyMember.upsert({ where: { companyId_userId: { companyId: company.id, userId } }, update: {}, create: { companyId: company.id, userId } });

  const products = [
    { sku: "COF-001", name: "Coffee beans", priceInCents: 3490, minStock: 10 },
    { sku: "MUG-001", name: "Ceramic mug", priceInCents: 2490, minStock: 8 },
    { sku: "TEA-001", name: "Black tea", priceInCents: 1590, minStock: 12 },
  ];
  const saved = [];
  for (const product of products) saved.push(await prisma.product.upsert({ where: { companyId_sku: { companyId: company.id, sku: product.sku } }, update: product, create: { ...product, companyId: company.id } }));
  await prisma.stockMovement.deleteMany({ where: { companyId: company.id } });
  await prisma.stockMovement.createMany({ data: saved.map((product, index) => ({ companyId: company.id, productId: product.id, quantity: [45, 24, 60][index]!, type: "ENTRY" as const, note: "Initial demo stock" })) });
  console.log(`Seeded ${company.name} with ${saved.length} products.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
