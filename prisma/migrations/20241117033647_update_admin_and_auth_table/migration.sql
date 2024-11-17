/*
  Warnings:

  - Made the column `email` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `countryCode` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "countryCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "roleId" TEXT;
