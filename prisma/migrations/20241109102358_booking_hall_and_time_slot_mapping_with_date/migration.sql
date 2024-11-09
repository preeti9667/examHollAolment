/*
  Warnings:

  - Added the required column `timeSlotId` to the `BookingHall` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookingHall" ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "timeSlotId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BookingHall" ADD CONSTRAINT "BookingHall_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
