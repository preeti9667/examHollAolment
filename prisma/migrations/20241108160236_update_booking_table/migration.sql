/*
  Warnings:

  - You are about to drop the column `exam_id` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the `_exam_time_slots` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `exam_name` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_exam_time_slots" DROP CONSTRAINT "_exam_time_slots_A_fkey";

-- DropForeignKey
ALTER TABLE "_exam_time_slots" DROP CONSTRAINT "_exam_time_slots_B_fkey";

-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_exam_id_fkey";

-- DropIndex
DROP INDEX "booking_exam_id_idx";

-- DropIndex
DROP INDEX "booking_user_id_exam_id_idx";

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "exam_id",
ADD COLUMN     "address" JSONB,
ADD COLUMN     "exam_name" TEXT NOT NULL,
ALTER COLUMN "halls" DROP NOT NULL,
ALTER COLUMN "time_slots" DROP NOT NULL;

-- DropTable
DROP TABLE "_exam_time_slots";
