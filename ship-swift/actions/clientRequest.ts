import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClientRequest = async (requestData: {
  receiverId: string;
  senderId: string;
  message: string;
}) => {
  try {
    const newRequest = await prisma.clientRequests.create({
      data: {
        receiverId: requestData.receiverId,
        senderId: requestData.senderId,
        message: requestData.message,
      },
    });
    return { success: true, data: newRequest };
  } catch (error) {
    return { success: false, error: "Error creating client request" };
  }
};

export const getClientRequest = async (
  senderId: string,
  receiverId: string
) => {
  try {
    const requests = await prisma.clientRequests.findMany({
      where: { senderId: senderId, receiverId: receiverId },
    });
    return { success: true, data: requests };
  } catch (error) {
    return { success: false, error: "Error retrieving client request" };
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
