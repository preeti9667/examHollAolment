-- CreateTable
CREATE TABLE "auth_otp" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "user_id" TEXT,
    "phone_number" TEXT,
    "country_code" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_otp_pkey" PRIMARY KEY ("id")
);
