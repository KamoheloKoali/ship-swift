"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDriverRequest = async (requestData: {
  receiverId: string;
  senderId: string;
  message: string;
}) => {
  const newRequest = await prisma.driverRequests.create({
    data: {
      receiverId: requestData.receiverId,
      senderId: requestData.senderId,
      message: requestData.message,
      isPending: true,
    },
  });
  if (newRequest.Id) return { success: true, data: newRequest };
  else return { success: false };
};

export const getDriverRequest = async (
  senderId: string,
  receiverId: string
) => {
  try {
    const requests = await prisma.driverRequests.findMany({
      where: { senderId: senderId, receiverId: receiverId },
    });
    if (requests.length > 0) return { success: true, data: requests };
    else return { success: false };
  } catch (error) {
    return { success: false, error: "Error retrieving driver request" };
  }
};

export const getDriverRequests = async (
  senderId: string = "",
  receiverId: string = ""
) => {
  try {
    if (senderId.length > 0) {
      // driver as sender
      const requests = await prisma.driverRequests.findMany({
        where: { senderId: senderId },
      });
      if (requests.length > 0) return { success: true, data: requests };
      else return { success: false };
    } else {
      // client as receiver
      const requests = await prisma.driverRequests.findMany({
        where: { receiverId: receiverId },
      });
      if (requests.length > 0) return { success: true, data: requests };
      else return { success: false };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving driver requests" };
  }
};

export const updateDriverRequest = async (
  requestId: string,
  requestData: Partial<any>
) => {
  try {
    const updatedRequest = await prisma.driverRequests.update({
      where: { Id: requestId },
      data: requestData,
    });
    return { success: true, data: updatedRequest };
  } catch (error) {
    return { success: false, error: "Error updating driver request" };
  }
};

export const deleteDriverRequest = async (requestId: string) => {
  try {
    const deletedRequest = await prisma.driverRequests.delete({
      where: { Id: requestId },
    });
    return { success: true, data: deletedRequest };
  } catch (error) {
    return { success: false, error: "Error deleting driver request" };
  }
};
