-- CreateTable
CREATE TABLE "OffDate" (
    "id" TEXT NOT NULL,
    "timeSlotId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OffDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OffDate" ADD CONSTRAINT "OffDate_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
