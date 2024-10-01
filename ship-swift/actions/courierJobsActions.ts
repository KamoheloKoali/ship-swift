import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (jobData: {
  title: string;
  description: string;
  budget: string;
  userId: string;
}) => {
  return await prisma.courierJobs.create({
    data: {
      Title: jobData.title,
      Description: jobData.description,
      Budget: jobData.budget,
      userId: jobData.userId,
    },
  });
};


export const getjobById = async (jobId: string) => {
  return await prisma.courierJobs.findUnique({
    where: { Id: jobId },
  });
};

export const updatejob = async (jobId: string, jobData: Partial<any>) => {
  return await prisma.courierJobs.update({
    where: { Id: jobId },
    data: jobData,
  });
};

export const deletejob = async (jobId: string) => {
  return await prisma.courierJobs.delete({
    where: { Id: jobId },
  });
};