/*
  Warnings:

  - Made the column `phoneNumber` on table `Drivers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicleType` on table `Drivers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discPhotoUrl` on table `Drivers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `licensePhotoUrl` on table `Drivers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Drivers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Drivers" ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "vehicleType" SET NOT NULL,
ALTER COLUMN "discPhotoUrl" SET NOT NULL,
ALTER COLUMN "licensePhotoUrl" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL;
