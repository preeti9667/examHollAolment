/*
  Warnings:

  - You are about to drop the column `from` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlotIds` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Booking` table. All the data in the column will be lost.
  - The `paymentMethod` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "from",
DROP COLUMN "timeSlotIds",
DROP COLUMN "to",
ADD COLUMN     "applicantName" TEXT,
ADD COLUMN     "contact" JSONB,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "institutionType" TEXT,
ADD COLUMN     "noOfCandidates" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "organizationName" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "timeSlotId" TEXT,
ALTER COLUMN "hallIds" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "examName" DROP NOT NULL,
ALTER COLUMN "totalCost" SET DEFAULT 0,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "PaymentMethod";
