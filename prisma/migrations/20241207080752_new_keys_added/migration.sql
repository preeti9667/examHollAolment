-- AlterTable
ALTER TABLE "PaymentRefund" ADD COLUMN     "processedAmount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdBy" TEXT;
