/*
  Warnings:

  - Changed the type of `status` on the `PaymentRefund` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `statusAt` on table `PaymentRefund` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaymentRefund" DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL,
ALTER COLUMN "statusAt" SET NOT NULL,
ALTER COLUMN "statusAt" SET DEFAULT CURRENT_TIMESTAMP;
