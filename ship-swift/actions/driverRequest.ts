import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDriverRequest = async (requestData: {
  receiverId: string;
  senderId: string;
  message: string;
}) => {
  return await prisma.driverRequests.create({
    data: {
      receiverId: requestData.receiverId,
      senderId: requestData.senderId,
      message: requestData.message,
    },
  });
};


export const getDriverRequestById = async (requestId: string) => {
  return await prisma.driverRequests.findUnique({
    where: { Id: requestId },
  });
};

export const updateDriverRequest = async (requestId: string, requestData: Partial<any>) => {
  return await prisma.driverRequests.update({
    where: { Id: requestId },
    data: requestData,
  });
};

export const deleteDriverRequest = async (requestId: string) => {
  return await prisma.driverRequests.delete({
    where: { Id: requestId },
  });
};