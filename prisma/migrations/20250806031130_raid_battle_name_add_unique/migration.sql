/*
  Warnings:

  - A unique constraint covering the columns `[battle]` on the table `raids` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "raids_battle_key" ON "public"."raids"("battle");
