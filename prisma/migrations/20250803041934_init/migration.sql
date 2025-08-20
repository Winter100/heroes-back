-- CreateEnum
CREATE TYPE "public"."StatType" AS ENUM ('ENTRY', 'LIMIT');

-- CreateTable
CREATE TABLE "public"."items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,
    "tierId" INTEGER NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enchantSlots" (
    "id" SERIAL NOT NULL,
    "slotId" INTEGER NOT NULL,

    CONSTRAINT "enchantSlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."raids" (
    "id" SERIAL NOT NULL,
    "raidTitleId" INTEGER NOT NULL,
    "battle" TEXT NOT NULL,
    "boss" TEXT NOT NULL,
    "image" TEXT NOT NULL,
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
    "raidId" INTEGER NOT NULL,
    "boostUp" BOOLEAN NOT NULL,
    "boostOnly" BOOLEAN NOT NULL,

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

-- CreateIndex
CREATE UNIQUE INDEX "stats_name_key" ON "public"."stats"("name");

-- CreateIndex
CREATE UNIQUE INDEX "basicClearRewardNames_name_key" ON "public"."basicClearRewardNames"("name");

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "public"."tiers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."recipes" ADD CONSTRAINT "recipes_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "public"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."recipes" ADD CONSTRAINT "recipes_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "public"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."enchants" ADD CONSTRAINT "enchants_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "public"."ranks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."enchants" ADD CONSTRAINT "enchants_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "public"."tiers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."enchants" ADD CONSTRAINT "enchants_affixId_fkey" FOREIGN KEY ("affixId") REFERENCES "public"."affixs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."effects" ADD CONSTRAINT "effects_enchantId_fkey" FOREIGN KEY ("enchantId") REFERENCES "public"."enchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."effects" ADD CONSTRAINT "effects_statId_fkey" FOREIGN KEY ("statId") REFERENCES "public"."stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enchantSlots" ADD CONSTRAINT "enchantSlots_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "public"."slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."raids" ADD CONSTRAINT "raids_raidTitleId_fkey" FOREIGN KEY ("raidTitleId") REFERENCES "public"."raidTitles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bossStats" ADD CONSTRAINT "bossStats_statId_fkey" FOREIGN KEY ("statId") REFERENCES "public"."stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bossStats" ADD CONSTRAINT "bossStats_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."raidBonusTargets" ADD CONSTRAINT "raidBonusTargets_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itemDrops" ADD CONSTRAINT "itemDrops_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itemDrops" ADD CONSTRAINT "itemDrops_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enchantDrops" ADD CONSTRAINT "enchantDrops_enchantId_fkey" FOREIGN KEY ("enchantId") REFERENCES "public"."enchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enchantDrops" ADD CONSTRAINT "enchantDrops_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."basicClearRewards" ADD CONSTRAINT "basicClearRewards_basicClearRewardNameId_fkey" FOREIGN KEY ("basicClearRewardNameId") REFERENCES "public"."basicClearRewardNames"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."basicClearRewards" ADD CONSTRAINT "basicClearRewards_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "public"."raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;
