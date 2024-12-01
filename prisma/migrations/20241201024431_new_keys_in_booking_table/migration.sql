-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "createdByAdmin" TEXT,
ADD COLUMN     "isPaymentDone" BOOLEAN,
ADD COLUMN     "paymentLink" TEXT;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_createdByAdmin_fkey" FOREIGN KEY ("createdByAdmin") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
