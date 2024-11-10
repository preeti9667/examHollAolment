-- DropForeignKey
ALTER TABLE "BookingHall" DROP CONSTRAINT "BookingHall_bookingId_fkey";

-- DropIndex
DROP INDEX "BookingHall_bookingId_idx";

-- CreateIndex
CREATE INDEX "BookingHall_bookingId_hallId_idx" ON "BookingHall"("bookingId", "hallId");

-- AddForeignKey
ALTER TABLE "BookingHall" ADD CONSTRAINT "BookingHall_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
