/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `slots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `value` to the `slots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."slots" ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "slots_value_key" ON "public"."slots"("value");
