/*
  Warnings:

  - You are about to drop the column `imageId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_imageId_fkey";

-- AlterTable
ALTER TABLE "public"."items" DROP COLUMN "imageId",
ADD COLUMN     "image" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."images";
