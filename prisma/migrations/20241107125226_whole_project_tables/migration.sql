-- CreateEnum
CREATE TYPE "AddOnType" AS ENUM ('SURVEILLANCE', 'SECURITY', 'FACE_RECOGINATION');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('APPROVED', 'CANCELLED', 'FAILED', 'DRAFT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'GATEWAY', 'UPI', 'CARD');

-- CreateTable
CREATE TABLE "hall" (
    "id" TEXT NOT NULL,
    "display_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group_name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "slots" TEXT[],
    "add_on_ids" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "booking_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "add_on" (
    "id" TEXT NOT NULL,
    "display_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AddOnType" NOT NULL DEFAULT 'SECURITY',
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "add_on_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_slot" (
    "id" TEXT NOT NULL,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam" (
    "id" TEXT NOT NULL,
    "display_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "time_slot_ids" TEXT[],
    "no_of_condidates" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "display_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "halls" JSONB NOT NULL,
    "hall_ids" TEXT[],
    "exam_id" TEXT NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "time_slots" JSONB NOT NULL,
    "time_slots_ids" TEXT[],
    "payment_method" "PaymentMethod" NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_hall" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "hall_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_hall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_add_on" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "add_on_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_add_on_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "display_id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
    "isSuper" BOOLEAN NOT NULL DEFAULT false,
    "permissions" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "display_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "country_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_hall_add_ons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_exam_time_slots" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "hall_display_id_key" ON "hall"("display_id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_display_id_key" ON "booking"("display_id");

-- CreateIndex
CREATE INDEX "booking_user_id_exam_id_idx" ON "booking"("user_id", "exam_id");

-- CreateIndex
CREATE INDEX "booking_user_id_idx" ON "booking"("user_id");

-- CreateIndex
CREATE INDEX "booking_exam_id_idx" ON "booking"("exam_id");

-- CreateIndex
CREATE INDEX "booking_hall_booking_id_idx" ON "booking_hall"("booking_id");

-- CreateIndex
CREATE INDEX "booking_add_on_booking_id_idx" ON "booking_add_on"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_display_id_key" ON "role"("display_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "admin_display_id_key" ON "admin"("display_id");

-- CreateIndex
CREATE INDEX "admin_phone_number_country_code_idx" ON "admin"("phone_number", "country_code");

-- CreateIndex
CREATE INDEX "admin_email_idx" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_hall_add_ons_AB_unique" ON "_hall_add_ons"("A", "B");

-- CreateIndex
CREATE INDEX "_hall_add_ons_B_index" ON "_hall_add_ons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_exam_time_slots_AB_unique" ON "_exam_time_slots"("A", "B");

-- CreateIndex
CREATE INDEX "_exam_time_slots_B_index" ON "_exam_time_slots"("B");

-- CreateIndex
CREATE INDEX "login_history_user_id_idx" ON "login_history"("user_id");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_country_code_phone_number_idx" ON "user"("country_code", "phone_number");

-- CreateIndex
CREATE INDEX "user_address_user_id_idx" ON "user_address"("user_id");

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_hall" ADD CONSTRAINT "booking_hall_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_hall" ADD CONSTRAINT "booking_hall_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "hall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_add_on" ADD CONSTRAINT "booking_add_on_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_add_on" ADD CONSTRAINT "booking_add_on_add_on_id_fkey" FOREIGN KEY ("add_on_id") REFERENCES "add_on"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_hall_add_ons" ADD CONSTRAINT "_hall_add_ons_A_fkey" FOREIGN KEY ("A") REFERENCES "add_on"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_hall_add_ons" ADD CONSTRAINT "_hall_add_ons_B_fkey" FOREIGN KEY ("B") REFERENCES "hall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_exam_time_slots" ADD CONSTRAINT "_exam_time_slots_A_fkey" FOREIGN KEY ("A") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_exam_time_slots" ADD CONSTRAINT "_exam_time_slots_B_fkey" FOREIGN KEY ("B") REFERENCES "time_slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
