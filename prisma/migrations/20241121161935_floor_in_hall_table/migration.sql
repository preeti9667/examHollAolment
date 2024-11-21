/*
  Warnings:

  - You are about to drop the column `addOnIds` on the `Hall` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hall" DROP COLUMN "addOnIds",
ADD COLUMN     "floor" INTEGER NOT NULL DEFAULT 0;
