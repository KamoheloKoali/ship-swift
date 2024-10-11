/*
  Warnings:

  - You are about to drop the column `diskExpiry` on the `Drivers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Drivers" DROP COLUMN "diskExpiry",
ADD COLUMN     "discExpiry" TEXT,
ADD COLUMN     "discPhotoUrl" TEXT,
ADD COLUMN     "licensePhotoUrl" TEXT;
