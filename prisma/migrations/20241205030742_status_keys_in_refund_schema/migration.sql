-- AlterTable
ALTER TABLE "PaymentRefund" ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "statusAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "PaymentRefund" ADD CONSTRAINT "PaymentRefund_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
