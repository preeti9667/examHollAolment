/*
  Warnings:

  - You are about to drop the column `institutionType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "institutionType",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "displayId" TEXT NOT NULL DEFAULT 'USR',
ADD COLUMN     "gstNo" TEXT;
