/*
  Warnings:

  - You are about to drop the column `timeSlotId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `BookingHall` table. All the data in the column will be lost.
  - Added the required column `timeSlotId` to the `BookingHall` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookingHall" DROP CONSTRAINT "BookingHall_bookingId_fkey";

-- DropIndex
DROP INDEX "BookingHall_bookingId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "timeSlotId",
ADD COLUMN     "timeSlotIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "BookingHall" DROP COLUMN "quantity",
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "seatsAllocated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timeSlotId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Hall" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "BookingHall_bookingId_hallId_idx" ON "BookingHall"("bookingId", "hallId");

-- AddForeignKey
ALTER TABLE "BookingHall" ADD CONSTRAINT "BookingHall_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHall" ADD CONSTRAINT "BookingHall_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
