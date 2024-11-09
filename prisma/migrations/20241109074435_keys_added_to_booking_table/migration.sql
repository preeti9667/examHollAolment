/*
  Warnings:

  - You are about to drop the column `from` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "applicantName" TEXT,
ADD COLUMN     "contact" JSONB,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "institutionType" TEXT,
ADD COLUMN     "noOfCandidates" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "organizationName" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ALTER COLUMN "hallIds" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "examName" DROP NOT NULL,
ALTER COLUMN "totalCost" SET DEFAULT 0,
ALTER COLUMN "timeSlotIds" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "paymentMethod" DROP NOT NULL;
