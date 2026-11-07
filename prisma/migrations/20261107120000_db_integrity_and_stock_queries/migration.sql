ALTER TABLE "SaleItem" ADD COLUMN "companyId" TEXT;
UPDATE "SaleItem" AS item SET "companyId" = sale."companyId" FROM "Sale" AS sale WHERE sale."id" = item."saleId";
ALTER TABLE "SaleItem" ALTER COLUMN "companyId" SET NOT NULL;

ALTER TABLE "SaleItem" DROP CONSTRAINT IF EXISTS "SaleItem_saleId_fkey";
ALTER TABLE "SaleItem" DROP CONSTRAINT IF EXISTS "SaleItem_productId_fkey";
ALTER TABLE "StockMovement" DROP CONSTRAINT IF EXISTS "StockMovement_productId_fkey";

CREATE UNIQUE INDEX "Product_companyId_id_key" ON "Product"("companyId", "id");
CREATE UNIQUE INDEX "Sale_companyId_id_key" ON "Sale"("companyId", "id");
CREATE INDEX "SaleItem_companyId_idx" ON "SaleItem"("companyId");

ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_sale_company_fkey" FOREIGN KEY ("companyId", "saleId") REFERENCES "Sale"("companyId", "id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_product_company_fkey" FOREIGN KEY ("companyId", "productId") REFERENCES "Product"("companyId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_product_company_fkey" FOREIGN KEY ("companyId", "productId") REFERENCES "Product"("companyId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Product" ADD CONSTRAINT "Product_priceInCents_nonnegative" CHECK ("priceInCents" >= 0);
ALTER TABLE "Product" ADD CONSTRAINT "Product_minStock_nonnegative" CHECK ("minStock" >= 0);
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_quantity_nonzero" CHECK ("quantity" <> 0);
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_sale_consistent" CHECK ("type" <> 'SALE' OR ("quantity" < 0 AND "saleId" IS NOT NULL));
