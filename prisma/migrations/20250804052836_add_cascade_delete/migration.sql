-- DropForeignKey
ALTER TABLE "public"."itemDrops" DROP CONSTRAINT "itemDrops_raidId_fkey";

-- DropForeignKey
ALTER TABLE "public"."raidBonusTargets" DROP CONSTRAINT "raidBonusTargets_raidId_fkey";

-- AddForeignKey
ALTER TABLE "public"."raidBonusTargets" ADD CONSTRAINT "raidBonusTargets_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itemDrops" ADD CONSTRAINT "itemDrops_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;
