/*
  Warnings:

  - A unique constraint covering the columns `[from,to]` on the table `time_slot` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "time_slot" ALTER COLUMN "from" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "to" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "time_slot_from_to_key" ON "time_slot"("from", "to");
