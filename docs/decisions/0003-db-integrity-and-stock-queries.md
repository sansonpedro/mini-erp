# 0003 — Database integrity and stock queries

Date: 2026-11-07
Status: accepted

Products and sales now have composite uniqueness on `(companyId, id)`. `SaleItem` stores and backfills `companyId`, and its product/sale relationships use composite foreign keys. Stock movements use the same company-scoped product foreign key with `ON DELETE RESTRICT`, preventing cross-company references and accidental deletion of products with ledger history.

The migration adds database CHECK constraints for non-negative prices and minimum stock, non-zero movements, and consistent SALE movement rows. Stock overview and dashboard low-stock calculations use one `groupBy` aggregation per read instead of loading every movement into application memory.
