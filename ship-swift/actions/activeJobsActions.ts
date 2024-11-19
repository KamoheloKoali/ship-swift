"use server";
import { PrismaClient } from "@prisma/client";
import notifyAboutJob from "./knock";

const prisma = new PrismaClient();

export async function createActiveJob(data: {
  courierJobId: string;
  driverId: string;
  clientId: string;
  startDate: string;
}) {
  // remember to send notification to driver that they have been hired for a new job here
  try {
    const newJob = await prisma.activeJobs.create({
      data: {
        courierJobId: data.courierJobId,
        driverId: data.driverId,
        clientId: data.clientId,
        startDate: data.startDate,
      },
      include: {
        Client: true,
        Driver: true,
        CourierJob: true,
      },
    });

    if (newJob.Id) {
      await notifyAboutJob(
        newJob.Driver,
        newJob.CourierJob,
        "",
        newJob.Client.firstName || "" + newJob.Client.lastName || ""
      );
    }
    return newJob;
  } catch (error) {
    console.error("Error creating ActiveJob:", error);
  }
}

export async function getActiveJobs() {
  try {
    const jobs = await prisma.activeJobs.findMany({
      include: {
        CourierJob: true,
        Driver: true,
        Client: true,
      },
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching ActiveJobs:", error);
  }
}

export async function getAllActiveJobsByDriverId(driverId: string) {
  try {
    const jobs = await prisma.activeJobs.findMany({
      where: { driverId: driverId },
      include: {
        CourierJob: true,
        Driver: true,
        Client: true,
      },
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching all ActiveJobs by driverId:", error);
  }
}

export async function getAllActiveJobsByClientId(clientId: string) {
  try {
    const jobs = await prisma.activeJobs.findMany({
      where: { clientId: clientId },
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching all ActiveJobs by clientId:", error);
  }
}

export async function getActiveJobByCourierJobId(courierJobId: string) {
  try {
    const job = await prisma.activeJobs.findFirst({
      where: { courierJobId: courierJobId },
    });
    return job;
  } catch (error) {
    console.error("Error fetching ActiveJob by courierJobId:", error);
  }
}

export async function updateActiveJobStatus(id: string, status: string) {
  try {
    const updatedData: { jobStatus: string; endDate?: string } = { jobStatus: status };

    if (status === "delivered") {
      updatedData.endDate = new Date().toISOString();
    }

    const updatedJob = await prisma.activeJobs.update({
      where: { Id: id },
      data: updatedData,
    });

    if (status !== "delivered") {
      await prisma.courierJobs.update({
        where: { Id: updatedJob.courierJobId },
        data: { packageStatus: status },
      });
    }

    return updatedJob;
  } catch (error) {
    console.error("Error updating Job status:", error);
    throw error;
  }
}

export async function deleteActiveJob(id: string) {
  try {
    const deletedJob = await prisma.activeJobs.delete({
      where: { Id: id },
    });
    return deletedJob;
  } catch (error) {
    console.error("Error deleting ActiveJob:", error);
  }
}
