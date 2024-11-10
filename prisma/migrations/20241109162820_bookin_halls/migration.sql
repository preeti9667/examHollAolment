-- DropIndex
DROP INDEX "BookingHall_bookingId_idx";

-- CreateIndex
CREATE INDEX "BookingHall_bookingId_hallId_idx" ON "BookingHall"("bookingId", "hallId");
