"use server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createLocation = async (locationData: {
  clientId: string;
  driverId: string;
  latitude: number; // Float
  longitude: number; // Float
  accuracy: number;
}) => {
  try {
    const newlocation = await prisma.location.create({
      data: {
        clientId: locationData.clientId,
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

export const getLocation = async (clientId: string, driverId: string) => {
  try {
    const location = await prisma.location.findMany({
      where: { clientId: clientId, driverId: driverId },
    });
    if (location) {
      return { success: true, data: location };
    } else {
      return { success: false, error: "location not found" };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving location" + error };
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
