CREATE TYPE "public"."AffixType" AS ENUM ('PREFIX', 'SUFFIX', 'INFUSION', 'PARTHOLN');

DROP INDEX "public"."affixs_value_key";


ALTER TABLE "public"."affixs" ALTER COLUMN "value" TYPE "public"."AffixType" USING ("value"::text::"public"."AffixType");

CREATE UNIQUE INDEX "affixs_value_key" ON "public"."affixs"("value");