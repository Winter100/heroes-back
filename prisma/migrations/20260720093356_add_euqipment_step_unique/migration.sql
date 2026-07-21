/*
  Warnings:

  - A unique constraint covering the columns `[itemId,stepName]` on the table `equipment_enhancements` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "equipment_enhancements_itemId_idx" ON "public"."equipment_enhancements"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_enhancements_itemId_stepName_key" ON "public"."equipment_enhancements"("itemId", "stepName");
