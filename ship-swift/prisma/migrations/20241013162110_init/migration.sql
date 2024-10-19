-- CreateTable
CREATE TABLE "clients" (
    "Id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "idPhotoUrl" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Drivers" (
    "Id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "idPhotoUrl" TEXT NOT NULL,
    "vehicleType" TEXT,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "VIN" TEXT,
    "idNumber" TEXT,
    "licenseExpiry" TEXT,
    "licenseNumber" TEXT,
    "plateNumber" TEXT,
    "discExpiry" TEXT,
    "discPhotoUrl" TEXT,
    "licensePhotoUrl" TEXT,
    "location" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Drivers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CourierJobs" (
    "Id" TEXT NOT NULL,
    "Title" TEXT DEFAULT '',
    "Description" TEXT DEFAULT '',
    "Budget" TEXT DEFAULT '0',
    "clientId" TEXT NOT NULL,
    "DropOff" TEXT DEFAULT '',
    "districtDropOff" TEXT DEFAULT '',
    "PickUp" TEXT DEFAULT '',
    "districtPickUp" TEXT DEFAULT '',
    "parcelSize" TEXT DEFAULT '',
    "pickupPhoneNumber" TEXT DEFAULT '',
    "dropoffPhoneNumber" TEXT DEFAULT '',
    "dropOffEmail" TEXT DEFAULT '',
    "collectionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "packageStatus" TEXT DEFAULT '',

    CONSTRAINT "CourierJobs_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "DriverRequests" (
    "Id" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "isPending" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DriverRequests_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "clientRequests" (
    "Id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "isPending" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "clientRequests_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "driver" BOOLEAN NOT NULL DEFAULT false,
    "client" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "Id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "isConversating" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "Id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Drivers_email_key" ON "Drivers"("email");

-- AddForeignKey
ALTER TABLE "CourierJobs" ADD CONSTRAINT "CourierJobs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverRequests" ADD CONSTRAINT "DriverRequests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverRequests" ADD CONSTRAINT "DriverRequests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientRequests" ADD CONSTRAINT "clientRequests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientRequests" ADD CONSTRAINT "clientRequests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
