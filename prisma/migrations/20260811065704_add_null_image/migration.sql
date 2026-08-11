/*
  Warnings:

  - A unique constraint covering the columns `[characterId,skillId]` on the table `characters_skills` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."characters" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."skills" ALTER COLUMN "image" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "characters_skills_characterId_skillId_key" ON "public"."characters_skills"("characterId", "skillId");
