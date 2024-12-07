-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "statusBy" TEXT,
ADD COLUMN     "statusLog" JSONB,
ADD COLUMN     "statusReason" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "statusBy" TEXT,
ADD COLUMN     "statusLog" JSONB,
ADD COLUMN     "statusReason" TEXT;
