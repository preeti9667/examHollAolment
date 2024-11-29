-- AlterTable
ALTER TABLE "PaymentRefund" ADD COLUMN     "bankDetails" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'UPI',
ADD COLUMN     "upiId" TEXT;
