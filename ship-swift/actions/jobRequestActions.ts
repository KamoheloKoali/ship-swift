"use server";
import { PrismaClient } from "@prisma/client";
import { createcontact } from "./contactsActions";
import { createActiveJob } from "./activeJobsActions";
import notifyAboutJob from "./knock";

const prisma = new PrismaClient();

export async function createJobRequest(data: {
  courierJobId: string;
  driverId: string;
}) {
  // send client a notification that there is a new applicant for their job
  const jobRequest = await prisma.jobRequest.create({
    data: {
      courierJobId: data.courierJobId,
      driverId: data.driverId,
    },
    include: {
      Driver: true,
      CourierJob: true,
    },
  });
  const Client = await prisma.clients.findUnique({
    where: {
      Id: jobRequest.CourierJob.clientId,
    },
  });
  if (jobRequest.Id && Client?.Id) {
    // send client a notification that there is a new applicant for their job
    await notifyAboutJob(
      Client,
      jobRequest.CourierJob,
      jobRequest.Driver.firstName || "" + jobRequest.Driver.lastName || ""
    );
  }
  return jobRequest;
}

export async function getAllJobRequests() {
  const directRequests = await prisma.directRequest.findMany({
    select: {
      courierJobId: true,
    },
  });

  const excludedJobIds = directRequests.map((request) => request.courierJobId);

  const jobRequests = await prisma.jobRequest.findMany({
    where: {
      NOT: {
        courierJobId: {
          in: excludedJobIds,
        },
      },
    },
    include: {
      CourierJob: true,
      Driver: true,
    },
  });

  return jobRequests;
}

export async function getJobRequestByDriverIdAndByCourierJobId(
  driverId: string,
  courierJobId: string
) {
  const jobRequest = await prisma.jobRequest.findMany({
    where: { driverId: driverId, courierJobId: courierJobId },
    include: {
      CourierJob: true,
      Driver: true,
    },
  });
  return jobRequest;
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

export async function getUnapprovedJobRequests(driverId: string) {
  const jobRequests = await prisma.jobRequest.findMany({
    where: { driverId: driverId, isApproved: false },
    include: {
      CourierJob: {
        include: {
          client: true,
        },
      },
      Driver: true,
    },
  });
  return jobRequests;
}

export async function approveJobRequest(data: {
  driverId: string;
  clientId: string;
  courierJobId: string;
}) {
  // First, we need to get the jobRequestId before we can proceed with parallel operations
  const request = await getJobRequestByDriverIdAndByCourierJobId(
    data.driverId,
    data.courierJobId
  );
  const jobRequestId = request[0].Id;

  // Get current date
  const date = new Date();
  const currentDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  // Group operations that can be executed concurrently
  const [jobRequest, courierJob, contact, setActiveJob] = await Promise.all([
    // Update job request
    prisma.jobRequest.update({
      where: { Id: jobRequestId },
      data: {
        isApproved: true,
      },
    }),

    // Update courier job
    prisma.courierJobs.update({
      where: {
        Id: data.courierJobId,
      },
      data: {
        packageStatus: "claimed",
        approvedRequestId: jobRequestId,
      },
    }),

    // Create contact
    createcontact({
      clientId: data.clientId,
      driverId: data.driverId,
    }),

    // Create active job
    createActiveJob({
      courierJobId: data.courierJobId,
      driverId: data.driverId,
      clientId: data.clientId,
      startDate: currentDate,
    }),
  ]);

  // Check if all operations were successful
  if (jobRequest.Id && courierJob.Id && contact.success && setActiveJob?.Id) {
    return 0;
  }
  if (contact.error === "contact already exists") {
    // check if reason for failure is because parties are already contacts
    return 2;
  }
  return 1;
}
