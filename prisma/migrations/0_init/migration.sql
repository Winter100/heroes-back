-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."EnchantCategory" AS ENUM ('ENCHANT', 'INFUSION');

-- CreateEnum
CREATE TYPE "public"."StatType" AS ENUM ('ENTRY', 'LIMIT');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" INTEGER NOT NULL,
    "tierId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipes" (
    "id" SERIAL NOT NULL,
    "resultId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tiers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."craftTitles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "craftTitles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enchants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rankId" INTEGER NOT NULL,
    "tierId" INTEGER NOT NULL,
    "affixId" INTEGER NOT NULL,
    "category" "public"."EnchantCategory" NOT NULL DEFAULT 'ENCHANT',

    CONSTRAINT "enchants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ranks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."affixs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "affixs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stats" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."effects" (
    "id" SERIAL NOT NULL,
    "enchantId" INTEGER NOT NULL,
    "statId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "effects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."slots" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enchantSlots" (
    "id" SERIAL NOT NULL,
    "slotId" INTEGER NOT NULL,
    "enchantId" INTEGER NOT NULL,

    CONSTRAINT "enchantSlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."raids" (
    "id" SERIAL NOT NULL,
    "raidTitleId" INTEGER NOT NULL,
    "battle" TEXT NOT NULL,
    "boss" TEXT NOT NULL,
    "image" TEXT,
    "level" INTEGER NOT NULL,

    CONSTRAINT "raids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."raidTitles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "raidTitles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bossStats" (
    "id" SERIAL NOT NULL,
    "statId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "raidId" INTEGER NOT NULL,
    "type" "public"."StatType" NOT NULL,

    CONSTRAINT "bossStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."raidBonusTargets" (
    "id" SERIAL NOT NULL,
    "bonus" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "raidId" INTEGER NOT NULL,

    CONSTRAINT "raidBonusTargets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."itemDrops" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "raidId" INTEGER NOT NULL,
    "boostUp" BOOLEAN NOT NULL,
    "boostOnly" BOOLEAN NOT NULL,

    CONSTRAINT "itemDrops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enchantDrops" (
    "id" SERIAL NOT NULL,
    "enchantId" INTEGER NOT NULL,
    "raidId" INTEGER,
    "itemId" INTEGER,

    CONSTRAINT "enchantDrops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."basicClearRewardNames" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "basicClearRewardNames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."basicClearRewards" (
    "id" SERIAL NOT NULL,
    "basicClearRewardNameId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "raidId" INTEGER NOT NULL,

    CONSTRAINT "basicClearRewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."characters" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."characters_skills" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "characters_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."refreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "refreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_name_key" ON "public"."items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tiers_name_key" ON "public"."tiers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "craftTitles_name_key" ON "public"."craftTitles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "enchants_name_key" ON "public"."enchants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_name_key" ON "public"."ranks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "affixs_name_key" ON "public"."affixs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "affixs_value_key" ON "public"."affixs"("value");

-- CreateIndex
CREATE UNIQUE INDEX "stats_name_key" ON "public"."stats"("name");

-- CreateIndex
CREATE UNIQUE INDEX "slots_name_key" ON "public"."slots"("name");

-- CreateIndex
CREATE UNIQUE INDEX "slots_value_key" ON "public"."slots"("value");

-- CreateIndex
CREATE UNIQUE INDEX "raids_battle_key" ON "public"."raids"("battle");

-- CreateIndex
CREATE UNIQUE INDEX "raidTitles_name_key" ON "public"."raidTitles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "basicClearRewardNames_name_key" ON "public"."basicClearRewardNames"("name");

-- CreateIndex
CREATE UNIQUE INDEX "characters_name_key" ON "public"."characters"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "public"."skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "public"."users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refreshToken_token_key" ON "public"."refreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "refreshToken_userId_key" ON "public"."refreshToken"("userId");

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "public"."tiers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."recipes" ADD CONSTRAINT "recipes_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "public"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."recipes" ADD CONSTRAINT "recipes_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "public"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."enchants" ADD CONSTRAINT "enchants_affixId_fkey" FOREIGN KEY ("affixId") REFERENCES "public"."affixs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."enchants" ADD CONSTRAINT "enchants_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "public"."ranks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."enchants" ADD CONSTRAINT "enchants_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "public"."tiers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."effects" ADD CONSTRAINT "effects_enchantId_fkey" FOREIGN KEY ("enchantId") REFERENCES "public"."enchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."effects" ADD CONSTRAINT "effects_statId_fkey" FOREIGN KEY ("statId") REFERENCES "public"."stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enchantSlots" ADD CONSTRAINT "enchantSlots_enchantId_fkey" FOREIGN KEY ("enchantId") REFERENCES "public"."enchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enchantSlots" ADD CONSTRAINT "enchantSlots_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "public"."slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."raids" ADD CONSTRAINT "raids_raidTitleId_fkey" FOREIGN KEY ("raidTitleId") REFERENCES "public"."raidTitles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bossStats" ADD CONSTRAINT "bossStats_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bossStats" ADD CONSTRAINT "bossStats_statId_fkey" FOREIGN KEY ("statId") REFERENCES "public"."stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."raidBonusTargets" ADD CONSTRAINT "raidBonusTargets_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itemDrops" ADD CONSTRAINT "itemDrops_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itemDrops" ADD CONSTRAINT "itemDrops_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enchantDrops" ADD CONSTRAINT "enchantDrops_enchantId_fkey" FOREIGN KEY ("enchantId") REFERENCES "public"."enchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enchantDrops" ADD CONSTRAINT "enchantDrops_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enchantDrops" ADD CONSTRAINT "enchantDrops_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."basicClearRewards" ADD CONSTRAINT "basicClearRewards_basicClearRewardNameId_fkey" FOREIGN KEY ("basicClearRewardNameId") REFERENCES "public"."basicClearRewardNames"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."basicClearRewards" ADD CONSTRAINT "basicClearRewards_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."characters_skills" ADD CONSTRAINT "characters_skills_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."characters_skills" ADD CONSTRAINT "characters_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."refreshToken" ADD CONSTRAINT "refreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

