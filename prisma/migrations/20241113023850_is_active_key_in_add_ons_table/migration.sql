/*
  Warnings:

  - The `type` column on the `AddOn` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AddOn" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'SECURITY';

-- DropEnum
DROP TYPE "AddOnType";
