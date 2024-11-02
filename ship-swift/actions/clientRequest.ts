"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClientRequest = async (requestData: {
  receiverId: string;
  senderId: string;
}) => {
  const newRequest = await prisma.clientRequests.create({
    data: {
      receiverId: requestData.receiverId,
      senderId: requestData.senderId,
      isPending: true,
    },
  });
  if (newRequest.Id) return { success: true, data: newRequest };
  else return { success: false };
};

export const getClientRequest = async (
  senderId: string,
  receiverId: string
) => {
  try {
    const requests = await prisma.clientRequests.findMany({
      where: { senderId: senderId, receiverId: receiverId },
    });
    if (requests.length > 0) return { success: true, data: requests };
  } catch (error) {
    return { success: false, error: "Error retrieving client request" };
  }
};

export const getClientRequests = async (
  senderId: string = "",
  receiverId: string = ""
) => {
  try {
    if (senderId.length > 0) {
      const requests = await prisma.clientRequests.findMany({
        where: { senderId: senderId },
      });

      if (requests.length > 0) return { success: true, data: requests };
    } else {
      const requests = await prisma.clientRequests.findMany({
        where: { receiverId: receiverId },
      });
      if (requests.length > 0) return { success: true, data: requests };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving client requests" };
  }
};

export const updateClientRequest = async (
  requestId: string,
  requestData: Partial<any>
) => {
  try {
    const updatedRequest = await prisma.clientRequests.update({
      where: { Id: requestId },
      data: requestData,
    });
    await prisma.contacts.create({
      data: {
        clientId: requestData.senderId,
        driverId: requestData.receiverId,
      },
    });
    return { success: true, data: updatedRequest };
  } catch (error) {
    return { success: false, error: "Error updating client request" };
  }
};

export const deleteClientRequest = async (requestId: string) => {
  try {
    const deletedRequest = await prisma.clientRequests.delete({
      where: { Id: requestId },
    });
    return { success: true, data: deletedRequest };
  } catch (error) {
    return { success: false, error: "Error deleting client request" };
  }
};
