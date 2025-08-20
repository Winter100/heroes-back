/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `affixs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `affixs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `craftTitles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `enchants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `raidTitles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ranks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `slots` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `tiers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "affixs_name_key" ON "public"."affixs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "affixs_value_key" ON "public"."affixs"("value");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "craftTitles_name_key" ON "public"."craftTitles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "enchants_name_key" ON "public"."enchants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "raidTitles_name_key" ON "public"."raidTitles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_name_key" ON "public"."ranks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "slots_name_key" ON "public"."slots"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tiers_name_key" ON "public"."tiers"("name");
