-- DropForeignKey
ALTER TABLE "public"."equipment_enhancements" DROP CONSTRAINT "equipment_enhancements_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."recipes" DROP CONSTRAINT "recipes_materialId_fkey";

-- DropForeignKey
ALTER TABLE "public"."recipes" DROP CONSTRAINT "recipes_resultId_fkey";

-- DropIndex
DROP INDEX "public"."equipment_enhancements_itemId_stepName_key";

-- CreateTable
CREATE TABLE "public"."items_recipes" (
    "id" SERIAL NOT NULL,
    "resultId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "items_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "items_recipes_resultId_idx" ON "public"."items_recipes"("resultId");

-- CreateIndex
CREATE INDEX "items_recipes_materialId_idx" ON "public"."items_recipes"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "items_recipes_resultId_materialId_key" ON "public"."items_recipes"("resultId", "materialId");

-- AddForeignKey
ALTER TABLE "public"."equipment_enhancements" ADD CONSTRAINT "equipment_enhancements_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items_recipes" ADD CONSTRAINT "items_recipes_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "public"."equipment_enhancements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items_recipes" ADD CONSTRAINT "items_recipes_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "public"."equipment_enhancements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
