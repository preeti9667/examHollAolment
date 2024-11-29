/*
  Warnings:

  - Added the required column `displayId` to the `PaymentRefund` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentRefund" ADD COLUMN     "displayId" TEXT NOT NULL;
