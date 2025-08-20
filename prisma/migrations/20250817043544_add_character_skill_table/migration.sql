/*
  Warnings:

  - You are about to drop the column `characterId` on the `skills` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."skills" DROP CONSTRAINT "skills_characterId_fkey";

-- AlterTable
ALTER TABLE "public"."skills" DROP COLUMN "characterId";

-- CreateTable
CREATE TABLE "public"."characters_skills" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "characters_skills_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."characters_skills" ADD CONSTRAINT "characters_skills_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."characters_skills" ADD CONSTRAINT "characters_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
