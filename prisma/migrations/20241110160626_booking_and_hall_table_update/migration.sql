/*
  Warnings:

  - You are about to drop the column `from` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Booking` table. All the data in the column will be lost.
  - The `paymentMethod` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `quantity` on the `BookingHall` table. All the data in the column will be lost.
  - Added the required column `timeSlotId` to the `BookingHall` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookingHall" DROP CONSTRAINT "BookingHall_bookingId_fkey";

-- DropIndex
DROP INDEX "BookingHall_bookingId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "applicantName" TEXT,
ADD COLUMN     "contact" JSONB,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "hallAllocated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "institutionType" TEXT,
ADD COLUMN     "noOfCandidates" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "organizationName" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ALTER COLUMN "hallIds" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "examName" DROP NOT NULL,
ALTER COLUMN "totalCost" SET DEFAULT 0,
ALTER COLUMN "timeSlotIds" SET DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "BookingHall" DROP COLUMN "quantity",
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "hallRaw" JSONB,
ADD COLUMN     "seatsAllocated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slotRaw" JSONB,
ADD COLUMN     "timeSlotId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Hall" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TimeSlot" ADD COLUMN     "hallId" TEXT;

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "PaymentMethod";

-- CreateTable
CREATE TABLE "_HallTimeSlot" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HallTimeSlot_AB_unique" ON "_HallTimeSlot"("A", "B");

-- CreateIndex
CREATE INDEX "_HallTimeSlot_B_index" ON "_HallTimeSlot"("B");

-- CreateIndex
CREATE INDEX "BookingHall_bookingId_hallId_idx" ON "BookingHall"("bookingId", "hallId");

-- AddForeignKey
ALTER TABLE "BookingHall" ADD CONSTRAINT "BookingHall_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHall" ADD CONSTRAINT "BookingHall_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HallTimeSlot" ADD CONSTRAINT "_HallTimeSlot_A_fkey" FOREIGN KEY ("A") REFERENCES "Hall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HallTimeSlot" ADD CONSTRAINT "_HallTimeSlot_B_fkey" FOREIGN KEY ("B") REFERENCES "TimeSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
