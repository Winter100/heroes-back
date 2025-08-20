-- DropForeignKey
ALTER TABLE "public"."bossStats" DROP CONSTRAINT "bossStats_raidId_fkey";

-- AddForeignKey
ALTER TABLE "public"."bossStats" ADD CONSTRAINT "bossStats_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;
