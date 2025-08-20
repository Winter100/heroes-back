/*
  Warnings:

  - You are about to drop the column `boostOnly` on the `enchantDrops` table. All the data in the column will be lost.
  - You are about to drop the column `boostUp` on the `enchantDrops` table. All the data in the column will be lost.
  - Added the required column `enchantId` to the `enchantSlots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."enchantDrops" DROP COLUMN "boostOnly",
DROP COLUMN "boostUp";

-- AlterTable
ALTER TABLE "public"."enchantSlots" ADD COLUMN     "enchantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."enchantSlots" ADD CONSTRAINT "enchantSlots_enchantId_fkey" FOREIGN KEY ("enchantId") REFERENCES "public"."enchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
