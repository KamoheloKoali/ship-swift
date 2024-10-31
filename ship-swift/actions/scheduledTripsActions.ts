"use server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new scheduled trip
export async function createScheduledTrip(
  tripData: Prisma.ScheduledTripsCreateInput
) {
  try {
    const newTrip = await prisma.scheduledTrips.create({
      data: tripData,
    });
    return newTrip;
  } catch (err) {
    console.error("Error creating scheduled trip:", err);
    throw err;
  }
}

// Get all scheduled trips
export async function getScheduledTrips() {
  try {
    const trips = await prisma.scheduledTrips.findMany();
    return trips;
  } catch (err) {
    console.error("Error fetching scheduled trips:", err);
    throw err;
  }
}

// Get a single scheduled trip by ID
export async function getScheduledTripById(id: string) {
  try {
    const trip = await prisma.scheduledTrips.findUnique({
      where: {
        id: id,
      },
    });
    return trip;
  } catch (err) {
    console.error("Error fetching scheduled trip:", err);
    throw err;
  }
}

// Update a scheduled trip
export async function updateScheduledTrip(
  id: string,
  updatedData: Prisma.ScheduledTripsUpdateInput
) {
  try {
    const updatedTrip = await prisma.scheduledTrips.update({
      where: {
        id: id,
      },
      data: updatedData,
    });
    return updatedTrip;
  } catch (err) {
    console.error("Error updating scheduled trip:", err);
    throw err;
  }
}

export async function getScheduledTripsByDriverId(driverId: string) {
  try {
    const trips = await prisma.scheduledTrips.findMany({
      where: {
        driver: {
          Id: driverId,
        },
        status: "SCHEDULED",
      },
    });
    return trips;
  } catch (err) {
    console.error("Error fetching scheduled trips:", err);
    throw err;
  }
}

// Delete a scheduled trip
export async function deleteScheduledTrip(id: string) {
  try {
    const deletedTrip = await prisma.scheduledTrips.delete({
      where: {
        id: id,
      },
    });
    return deletedTrip;
  } catch (err) {
    console.error("Error deleting scheduled trip:", err);
    throw err;
  }
}
