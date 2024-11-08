/*
  Warnings:

  - You are about to drop the column `isActive` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `hall` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `login_history` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `isSuper` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth" DROP COLUMN "isActive",
DROP COLUMN "isDeleted",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "hall" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "login_history" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "role" DROP COLUMN "isActive",
DROP COLUMN "isSuper",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_super" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isActive",
DROP COLUMN "isDeleted",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
