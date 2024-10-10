"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDriver = async (driverData: {
  clerkId: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
  idNumber?: string;
  licensePhotoUrl?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleType?: string;
  plateNumber?: string;
  VIN?: string;
  discExpiry?: string;
  discPhotoUrl?: string;
  location?: string;
}) => {
  try {
    const newDriver = await prisma.drivers.create({
      data: {
        Id: driverData.clerkId,
        email: driverData.email,
        phoneNumber: driverData.phoneNumber,
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        photoUrl: driverData.photoUrl,
        idPhotoUrl: driverData.idPhotoUrl,
        idNumber: driverData.idNumber,
        licensePhotoUrl: driverData.licensePhotoUrl,
        licenseNumber: driverData.licenseNumber,
        licenseExpiry: driverData.licenseExpiry,
        vehicleType: driverData.vehicleType,
        plateNumber: driverData.plateNumber,
        discPhotoUrl: driverData.discPhotoUrl,
        VIN: driverData.VIN,
        discExpiry: driverData.discExpiry,
        location: driverData.location,
      },
    });
    return { success: true, data: newDriver };
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

export const upsertDriver = async (driverData: {
  clerkId: string;
  email: string;
  phoneNumber?: string; // Now optional
  firstName: string;
  lastName: string;
  photoUrl?: string; // Make this optional as it might not be set in every update
  idPhotoUrl?: string; // Make this optional as it might not be set in every update
  idNumber?: string;
  licensePhotoUrl?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleType?: string;
  plateNumber?: string;
  VIN?: string;
  discExpiry?: string;
  discPhotoUrl?: string;
  location?: string;
}) => {
  try {
    const upsertedDriver = await prisma.drivers.upsert({
      where: { Id: driverData.clerkId },
      update: {
        email: driverData.email,
        phoneNumber: driverData.phoneNumber,
        firstName: driverData.firstName,
        lastName: driverData.lastName,
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
        ...(driverData.vehicleType && { vehicleType: driverData.vehicleType }),
        ...(driverData.plateNumber && { plateNumber: driverData.plateNumber }),
        ...(driverData.discPhotoUrl && {
          discPhotoUrl: driverData.discPhotoUrl,
        }),
        ...(driverData.VIN && { VIN: driverData.VIN }),
        ...(driverData.discExpiry && { discExpiry: driverData.discExpiry }),
      },
      create: {
        Id: driverData.clerkId,
        email: driverData.email,
        phoneNumber: driverData.phoneNumber,
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        photoUrl: driverData.photoUrl || "",
        idPhotoUrl: driverData.idPhotoUrl || "",
        idNumber: driverData.idNumber,
        licensePhotoUrl: driverData.licensePhotoUrl,
        licenseNumber: driverData.licenseNumber,
        licenseExpiry: driverData.licenseExpiry,
        vehicleType: driverData.vehicleType,
        plateNumber: driverData.plateNumber,
        discPhotoUrl: driverData.discPhotoUrl,
        VIN: driverData.VIN,
        discExpiry: driverData.discExpiry,
        location: driverData.location,
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

export const getDriverByID = async (driverId: string) => {
  try {
    const driver = await prisma.drivers.findUnique({
      where: {
        Id: driverId,
      },
      include: {
        Contacts: true, // If you want to include related Contacts
        driveRequests: true, // If you want to include related DriverRequests
        Messages: true, // If you want to include related Messages
        clientRequests: true, // If you want to include related clientRequests
      },
    });

    if (!driver) {
      throw new Error("Driver not found");
    }

    return driver;
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
