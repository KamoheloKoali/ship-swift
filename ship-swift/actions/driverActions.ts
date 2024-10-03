"use server"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDriver = async (driverData: {
  clerkId: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
  vehicleType: string;
  vehicleDetails: string[];
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
        vehicleType: driverData.vehicleType,
        vehicleDetails: driverData.vehicleDetails,
      },
    });
    return { success: true, data: newDriver };
  } catch (error) {
    return { success: false, error: "Error creating driver" };
  }
};

export const getDriverById = async (driverId: string) => {
  try {
    const driver = await prisma.drivers.findUnique({
      where: { Id: driverId },
    });
    if (driver) {
      return { success: true, data: driver };
    } else {
      return { success: false, error: 'Driver not found' };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving driver" };
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

export const updateDriver = async (driverId: string, driverData: Partial<any>) => {
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
