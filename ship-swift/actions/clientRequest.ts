import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createClientRequest = async (requestData: {
  receiverId: string;
  senderId: string;
  message: string;
}) => {
  return await prisma.clientRequests.create({
    data: {
      receiverId: requestData.receiverId,
      senderId: requestData.senderId,
      message: requestData.message,
    },
  });
};


export const getClientRequestById = async (requestId: string) => {
  return await prisma.clientRequests.findUnique({
    where: { Id: requestId },
  });
};

export const updateClientRequest = async (requestId: string, requestData: Partial<any>) => {
  return await prisma.clientRequests.update({
    where: { Id: requestId },
    data: requestData,
  });
};

export const deleteClientRequest = async (requestId: string) => {
  return await prisma.clientRequests.delete({
    where: { Id: requestId },
  });
};