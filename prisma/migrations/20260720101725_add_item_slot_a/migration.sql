/*
  Warnings:

  - You are about to drop the `_ItemToSlot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ItemToSlot" DROP CONSTRAINT "_ItemToSlot_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ItemToSlot" DROP CONSTRAINT "_ItemToSlot_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_tierId_fkey";

-- DropTable
DROP TABLE "public"."_ItemToSlot";

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "public"."slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "public"."tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
