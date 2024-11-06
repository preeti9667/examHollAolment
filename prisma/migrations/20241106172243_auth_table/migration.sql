-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ADMIN', 'CUSTOMER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "auth" (
    "id" TEXT NOT NULL,
    "phone_number" TEXT,
    "country_code" TEXT,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "type" "AccountType" NOT NULL DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auth_country_code_phone_number_idx" ON "auth"("country_code", "phone_number");

-- CreateIndex
CREATE INDEX "auth_email_idx" ON "auth"("email");
