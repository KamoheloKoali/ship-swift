import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUserRequest = async (requestData: {
  receiverId: string;
  senderId: string;
  message: string;
}) => {
  return await prisma.userRequests.create({
    data: {
      receiverId: requestData.receiverId,
      senderId: requestData.senderId,
      message: requestData.message,
    },
  });
};


export const getUserRequestById = async (requestId: string) => {
  return await prisma.userRequests.findUnique({
    where: { Id: requestId },
  });
};

export const updateUserRequest = async (requestId: string, requestData: Partial<any>) => {
  return await prisma.userRequests.update({
    where: { Id: requestId },
    data: requestData,
  });
};

export const deleterequest = async (requestId: string) => {
  return await prisma.userRequests.delete({
    where: { Id: requestId },
  });
};