-- AlterTable
ALTER TABLE "public"."enchantDrops" ADD COLUMN     "itemId" INTEGER,
ALTER COLUMN "raidId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."items" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "imageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."enchantDrops" ADD CONSTRAINT "enchantDrops_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
