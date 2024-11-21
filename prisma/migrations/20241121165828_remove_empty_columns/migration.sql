/*
  Warnings:

  - You are about to drop the column `hallIds` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `halls` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlotIds` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlots` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "hallIds",
DROP COLUMN "halls",
DROP COLUMN "timeSlotIds",
DROP COLUMN "timeSlots";
