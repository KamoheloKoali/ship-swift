"use server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createLocation = async (locationData: {
  driverId: string;
  latitude: number; // Float
  longitude: number; // Float
  accuracy: number;
}) => {
  try {
    const newlocation = await prisma.location.create({
      data: {
        driverId: locationData.driverId,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
      },
    });
    if (newlocation.Id) return { success: true, data: newlocation };
    else return { success: false };
  } catch (error) {
    return { success: false, error: "Error creating location" + error };
  }
};

export const getLocation = async (driverId: string) => {
  try {
    // Get all locations
    const locations = await prisma.location.findMany({
      where: { driverId },
      orderBy: {
        time: "desc",
      },
    });

    // Get latest location
    const latestLocation = await prisma.location.findFirst({
      where: { driverId },
      orderBy: {
        time: "desc",
      },
    });

    if (locations.length > 0) {
      return {
        success: true,
        data: {
          all: locations,
          latest: latestLocation,
        },
      };
    } else {
      return { success: false, error: "No locations found for this driver" };
    }
  } catch (error) {
    return { success: false, error: `Error retrieving location: ${error}` };
  }
};

// Alternative: Separate functions for different use cases
export const getAllLocations = async (driverId: string) => {
  try {
    const locations = await prisma.location.findMany({
      where: { driverId },
      orderBy: {
        time: "desc",
      },
    });

    if (locations.length > 0) {
      return { success: true, data: locations };
    } else {
      return { success: false, error: "No locations found for this driver" };
    }
  } catch (error) {
    return { success: false, error: `Error retrieving locations: ${error}` };
  }
};

export const getLatestLocation = async (driverId: string) => {
  try {
    const location = await prisma.location.findFirst({
      where: { driverId },
      orderBy: {
        time: "desc",
      },
    });

    if (location) {
      return { success: true, data: location };
    } else {
      return { success: false, error: "No location found for this driver" };
    }
  } catch (error) {
    return { success: false, error: `Error retrieving location: ${error}` };
  }
};

export const deleteLocation = async (locationId: string) => {
  try {
    const deletedlocation = await prisma.location.delete({
      where: { Id: locationId },
    });
    return { success: true, data: deletedlocation };
  } catch (error) {
    return { success: false, error: "Error deleting location" + error };
  }
};
