-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "paidAmount" DOUBLE PRECISION,
ADD COLUMN     "paymentMode" TEXT,
ADD COLUMN     "sabpaisaTxnId" TEXT,
ADD COLUMN     "transDate" TIMESTAMP(3),
ADD COLUMN     "transaction" JSONB;
