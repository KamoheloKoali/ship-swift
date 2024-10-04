import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createJob = async (jobData: {
  title: string;
  description: string;
  budget: string;
  clientId: string;
  DropOff: string;
  PickUp: string;
}) => {
  try {
    const newJob = await prisma.courierJobs.create({
      data: {
        Title: jobData.title,
        Description: jobData.description,
        Budget: jobData.budget,
        clientId: jobData.clientId,
        DropOff: jobData.DropOff,
        PickUp: jobData.PickUp,
      },
    });
    return { success: true, data: newJob };
  } catch (error) {
    return { success: false, error: "Error creating job" };
  }
};

export const getJobById = async (jobId: string) => {
  try {
    const job = await prisma.courierJobs.findUnique({
      where: { Id: jobId },
    });
    if (job) {
      return { success: true, data: job };
    } else {
      return { success: false, error: 'Job not found' };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving job" };
  }
};

export const updateJob = async (jobId: string, jobData: Partial<any>) => {
  try {
    const updatedJob = await prisma.courierJobs.update({
      where: { Id: jobId },
      data: jobData,
    });
    return { success: true, data: updatedJob };
  } catch (error) {
    return { success: false, error: "Error updating job" };
  }
};

export const deleteJob = async (jobId: string) => {
  try {
    const deletedJob = await prisma.courierJobs.delete({
      where: { Id: jobId },
    });
    return { success: true, data: deletedJob };
  } catch (error) {
    return { success: false, error: "Error deleting job" };
  }
};
