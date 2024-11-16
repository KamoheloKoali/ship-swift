"use server";
import { PrismaClient } from "@prisma/client";
import { UserRoundPlus } from "lucide-react";

const prisma = new PrismaClient();

export const upsertDriver = async (driverData: {
  clerkId: string;
  email: string;
  phoneNumber: string; // Now required
  firstName: string;
  lastName: string;
  photoUrl?: string;
  idPhotoUrl?: string;
  idNumber?: string;
  licensePhotoUrl?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleType: string; // Now required
  plateNumber?: string;
  vehicleRegistrationNo?: string;
  discExpiry?: string;
  discPhotoUrl?: string;
  location: string; // Now required
}) => {
  try {
    const upsertedDriver = await prisma.drivers.upsert({
      where: { Id: driverData.clerkId },
      update: {
        email: driverData.email,
        phoneNumber: driverData.phoneNumber,
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        location: driverData.location,
        vehicleType: driverData.vehicleType,
        ...(driverData.photoUrl && { photoUrl: driverData.photoUrl }),
        ...(driverData.idPhotoUrl && { idPhotoUrl: driverData.idPhotoUrl }),
        ...(driverData.idNumber && { idNumber: driverData.idNumber }),
        ...(driverData.licensePhotoUrl && {
          licensePhotoUrl: driverData.licensePhotoUrl,
        }),
        ...(driverData.licenseNumber && {
          licenseNumber: driverData.licenseNumber,
        }),
        ...(driverData.licenseExpiry && {
          licenseExpiry: driverData.licenseExpiry,
        }),
        ...(driverData.plateNumber && { plateNumber: driverData.plateNumber }),
        ...(driverData.discPhotoUrl && {
          discPhotoUrl: driverData.discPhotoUrl,
        }),
        ...(driverData.vehicleRegistrationNo && { vehicleRegistrationNo: driverData.vehicleRegistrationNo }),
        ...(driverData.discExpiry && { discExpiry: driverData.discExpiry }),
      },
      create: {
        Id: driverData.clerkId,
        email: driverData.email,
        phoneNumber: driverData.phoneNumber,
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        location: driverData.location,
        vehicleType: driverData.vehicleType,
        photoUrl: driverData.photoUrl || "",
        idPhotoUrl: driverData.idPhotoUrl || "",
        idNumber: driverData.idNumber,
        licensePhotoUrl: driverData.licensePhotoUrl,
        licenseNumber: driverData.licenseNumber,
        licenseExpiry: driverData.licenseExpiry,
        plateNumber: driverData.plateNumber,
        discPhotoUrl: driverData.discPhotoUrl,
        vehicleRegistrationNo: driverData.vehicleRegistrationNo,
        discExpiry: driverData.discExpiry,
      },
    });
    return { success: true, data: upsertedDriver };
  } catch (error) {
    console.error("Prisma error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  } finally {
    await prisma.$disconnect();
  }
};

export const getUnverifiedDrivers = async () => {
  try {
    const unverifiedDrivers = await prisma.drivers.findMany({
      where: {
        isVerified: false,
      },
    });
    return unverifiedDrivers;
  } catch (error) {
    console.error("Error fetching unverified drivers:", error);
    throw error;
  }
};

export const updateDriverVerification = async (
  driverId: string,
  isVerified: boolean = true
) => {
  try {
    const updatedDriver = await prisma.drivers.update({
      where: { Id: driverId },
      data: { isVerified: isVerified },
    });
    return updatedDriver;
  } catch (error) {
    console.error("Error updating driver verification:", error);
    throw error;
  }
};

export const VerifyDriver = async (
  driverId: string,
  data: {
    vehicleRegistrationNo: string;
    plateNumber: string;
    discExpiry: string;
    idNumber: string;
    licenseNumber: string;
    licenseExpiry: string;
  }
) => {
  try {
    const updatedDriver = await prisma.drivers.update({
      where: { Id: driverId },
      data: { isVerified: true, ...data },
    });
    return updatedDriver;
  } catch (error) {
    console.error("Error updating driver verification:", error);
    throw error;
  }
};

export const getDriverByID = async (driverId: string) => {
  try {
    const driver = await prisma.drivers.findUnique({
      where: {
        Id: driverId,
      },
    });

    if (!driver) {
      return { success: false, error: "Driver not found" };
    }

    return { success: true, data: driver };
  } catch (error) {
    console.error("Error fetching driver by ID:", error);
    throw error;
  }
};

export const getAllDrivers = async () => {
  const drivers = await prisma.drivers.findMany(); // Remove where clause to get all clients
  if (drivers.length > 0) {
    return { success: true, data: drivers };
  } else {
    return { success: false, error: "No clients found" };
  }
};

export const getAllVerifiedDrivers = async () => {
  const drivers = await prisma.drivers.findMany({
    where: { isVerified: true }
  });
  if (drivers.length > 0) {
    return { success: true, data: drivers };
  } else {
    return { success: false, error: "No verified drivers found" };
  }
};

export const updateDriver = async (
  driverId: string,
  driverData: Partial<any>
) => {
  try {
    const updatedDriver = await prisma.drivers.update({
      where: { Id: driverId },
      data: driverData,
    });

    return { success: true, data: updatedDriver };
  } catch (error) {
    return { success: false, error: "Error updating driver" };
  }
};

export const updateOnlineStatus = async (driverId: string, isOnline: boolean) => {
  try {
    const updatedDriver = await prisma.drivers.update({
      where: { Id: driverId },
      data: { isOnline: isOnline },
    });
    return { success: true, data: updatedDriver };
  } catch (error) {
    return { success: false, error: "Error updating driver" };
  }
};

export const deleteDriver = async (driverId: string) => {
  try {
    const deletedDriver = await prisma.drivers.delete({
      where: { Id: driverId },
    });
    return { success: true, data: deletedDriver };
  } catch (error) {
    return { success: false, error: "Error deleting driver" };
  }
};
