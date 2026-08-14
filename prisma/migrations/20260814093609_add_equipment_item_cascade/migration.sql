-- DropForeignKey
ALTER TABLE "public"."equipment_enhancements" DROP CONSTRAINT "equipment_enhancements_itemId_fkey";

-- AddForeignKey
ALTER TABLE "public"."equipment_enhancements" ADD CONSTRAINT "equipment_enhancements_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
