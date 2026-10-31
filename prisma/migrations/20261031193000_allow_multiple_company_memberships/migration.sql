DROP INDEX IF EXISTS "CompanyMember_userId_key";

CREATE INDEX IF NOT EXISTS "CompanyMember_userId_idx" ON "CompanyMember"("userId");
