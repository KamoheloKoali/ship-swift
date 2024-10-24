import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createJobRequest(data: {
  courierJobId: string;
  driverId: string;
}) {
  const jobRequest = await prisma.jobRequest.create({
    data: {
      courierJobId: data.courierJobId,
      driverId: data.driverId,
    },
  });
  return jobRequest;
}

export async function getAllJobRequests() {
  const jobRequests = await prisma.jobRequest.findMany({
    include: {
      CourierJob: true, // Include related CourierJob details
      Driver: true, // Include related Driver details
    },
  });
  return jobRequests;
}

export async function getJobRequestById(id: string) {
  const jobRequest = await prisma.jobRequest.findUnique({
    where: { Id: id },
    include: {
      CourierJob: true,
      Driver: true,
    },
  });
  return jobRequest;
}

export async function updateJobRequest(
  id: string,
  data: Partial<{
    offerAmount: string;
    isApproved: boolean;
  }>
) {
  const updatedJobRequest = await prisma.jobRequest.update({
    where: { Id: id },
    data,
  });
  return updatedJobRequest;
}

export async function deleteJobRequest(id: string) {
  const deletedJobRequest = await prisma.jobRequest.delete({
    where: { Id: id },
  });
  return deletedJobRequest;
}

export async function getJobRequestsByCourierJobId(courierJobId: string) {
  const jobRequests = await prisma.jobRequest.findMany({
    where: { courierJobId: courierJobId },
    include: {
      CourierJob: true,
      Driver: true,
    },
  });
  return jobRequests;
}

export async function getJobRequestsByDriverId(driverId: string) {
  const jobRequests = await prisma.jobRequest.findMany({
    where: { driverId: driverId },
    include: {
      CourierJob: true,
      Driver: true,
    },
  });
  return jobRequests;
}
