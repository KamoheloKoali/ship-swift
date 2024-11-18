"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createDeliveredJob(data: {
  activeJobId: string;
  locationId: string;
  proofOfDeliveryUrl: string;
}) {
  try {
    const deliveredJob = await prisma.deliveredJobs.create({
      data: {
        activeJobId: data.activeJobId,
        locationId: data.locationId,
        proofOfDeliveryUrl: data.proofOfDeliveryUrl,
        isDriverConfirmed: true,
        isClientConfirmed: false,
      },
      include: {
        ActiveJob: true,
        Location: true,
      },
    });

    return deliveredJob;
  } catch (error) {
    console.error("Error creating delivered job:", error);
    throw error;
  }
}

export async function confirmClientDelivery(deliveredJobId: string) {
  try {
    const updatedJob = await prisma.deliveredJobs.update({
      where: {
        Id: deliveredJobId,
      },
      data: {
        isClientConfirmed: true,
      },
    });

    return updatedJob;
  } catch (error) {
    console.error("Error confirming delivery for client:", error);
    throw error;
  }
}

export async function getDeliveredJobDetails(deliveredJobId: string) {
  try {
    const deliveredJob = await prisma.deliveredJobs.findUnique({
      where: {
        Id: deliveredJobId,
      },
      include: {
        ActiveJob: {
          include: {
            Client: true,
            Driver: true,
            CourierJob: true,
          },
        },
        Location: true,
      },
    });

    return deliveredJob;
  } catch (error) {
    console.error("Error fetching delivered job details:", error);
    throw error;
  }
}

export async function getDeliveredJobsByDriver(driverId: string) {
  try {
    const deliveredJobs = await prisma.deliveredJobs.findMany({
      where: {
        ActiveJob: {
          driverId: driverId,
        },
      },
      include: {
        ActiveJob: true,
        Location: true,
      },
    });

    return deliveredJobs;
  } catch (error) {
    console.error("Error fetching delivered jobs for driver:", error);
    throw error;
  }
}
