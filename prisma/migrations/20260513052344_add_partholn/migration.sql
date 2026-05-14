-- AlterTable
ALTER TABLE "public"."effects" ADD COLUMN     "partholnId" INTEGER,
ALTER COLUMN "enchantId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."partholns" (
    "id" SERIAL NOT NULL,
    "name" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "affixId" INTEGER NOT NULL,

    CONSTRAINT "partholns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."partholns" ADD CONSTRAINT "partholns_affixId_fkey" FOREIGN KEY ("affixId") REFERENCES "public"."affixs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."effects" ADD CONSTRAINT "effects_partholnId_fkey" FOREIGN KEY ("partholnId") REFERENCES "public"."partholns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
