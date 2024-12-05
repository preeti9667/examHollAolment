-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL DEFAULT 'USR',
    "name" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "countryCode" TEXT,
    "bio" TEXT,
    "gstNo" TEXT,
    "jobTitle" TEXT,
    "organizationName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthOtp" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "userId" TEXT,
    "phoneNumber" TEXT,
    "countryCode" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthOtp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "countryCode" TEXT,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "type" "AccountType" NOT NULL DEFAULT 'CUSTOMER',
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAddress" (
    "id" TEXT NOT NULL,
    "houseNo" TEXT,
    "street" TEXT,
    "addressLine" TEXT,
    "pincode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hall" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "slots" TEXT[],
    "floor" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "bookingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddOn" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SECURITY',
    "price" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HallTimeSlot" (
    "hallId" TEXT NOT NULL,
    "timeSlotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HallTimeSlot_pkey" PRIMARY KEY ("hallId","timeSlotId")
);

-- CreateTable
CREATE TABLE "HallAddOn" (
    "hallId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HallAddOn_pkey" PRIMARY KEY ("hallId","addOnId")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" TEXT NOT NULL,
    "from" DOUBLE PRECISION NOT NULL,
    "to" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hallId" TEXT,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "timeSlotIds" TEXT[],
    "noOfCandidates" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "noOfCandidates" INTEGER NOT NULL DEFAULT 0,
    "hallAllocated" INTEGER NOT NULL DEFAULT 0,
    "examName" TEXT,
    "organizationName" TEXT,
    "institutionType" TEXT,
    "applicantName" TEXT,
    "securityDeposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hallPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "addOnPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "address" JSONB,
    "contact" JSONB,
    "paymentMethod" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "gstNo" TEXT,
    "cancelReason" TEXT,
    "cancelledBy" JSONB,
    "createdByAdmin" TEXT,
    "isPaymentDone" BOOLEAN,
    "paymentLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingHall" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "hallId" TEXT NOT NULL,
    "timeSlotId" TEXT NOT NULL,
    "seatsAllocated" INTEGER NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "hallRaw" JSONB,
    "slotRaw" JSONB,
    "date" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingHall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingAddOn" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "addOnRaw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingAddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "sabpaisaTxnId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "paidAmount" DOUBLE PRECISION,
    "paymentMode" TEXT,
    "transDate" TIMESTAMP(3),
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "transaction" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentRefund" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "refundType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" INTEGER NOT NULL,
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'UPI',
    "upiId" TEXT,
    "bankDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT,
    "comment" TEXT,
    "statusAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentRefund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
    "isSuper" BOOLEAN NOT NULL DEFAULT false,
    "permissions" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "displayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OffDate" (
    "id" TEXT NOT NULL,
    "timeSlotId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "offType" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OffDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_countryCode_phoneNumber_idx" ON "User"("countryCode", "phoneNumber");

-- CreateIndex
CREATE INDEX "Auth_countryCode_phoneNumber_idx" ON "Auth"("countryCode", "phoneNumber");

-- CreateIndex
CREATE INDEX "Auth_email_idx" ON "Auth"("email");

-- CreateIndex
CREATE INDEX "LoginHistory_userId_idx" ON "LoginHistory"("userId");

-- CreateIndex
CREATE INDEX "UserAddress_userId_idx" ON "UserAddress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Hall_displayId_key" ON "Hall"("displayId");

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlot_from_to_key" ON "TimeSlot"("from", "to");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_displayId_key" ON "Booking"("displayId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "BookingHall_bookingId_hallId_idx" ON "BookingHall"("bookingId", "hallId");

-- CreateIndex
CREATE INDEX "BookingAddOn_bookingId_idx" ON "BookingAddOn"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_displayId_key" ON "Role"("displayId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_displayId_key" ON "Admin"("displayId");

-- CreateIndex
CREATE INDEX "Admin_phoneNumber_countryCode_idx" ON "Admin"("phoneNumber", "countryCode");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HallTimeSlot" ADD CONSTRAINT "HallTimeSlot_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HallTimeSlot" ADD CONSTRAINT "HallTimeSlot_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HallAddOn" ADD CONSTRAINT "HallAddOn_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HallAddOn" ADD CONSTRAINT "HallAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "AddOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_createdByAdmin_fkey" FOREIGN KEY ("createdByAdmin") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHall" ADD CONSTRAINT "BookingHall_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHall" ADD CONSTRAINT "BookingHall_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHall" ADD CONSTRAINT "BookingHall_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddOn" ADD CONSTRAINT "BookingAddOn_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddOn" ADD CONSTRAINT "BookingAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "AddOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRefund" ADD CONSTRAINT "PaymentRefund_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRefund" ADD CONSTRAINT "PaymentRefund_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRefund" ADD CONSTRAINT "PaymentRefund_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffDate" ADD CONSTRAINT "OffDate_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
