import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDriverRequest = async (requestData: {
  receiverId: string;
  senderId: string;
  message: string;
}) => {
  try {
    const newRequest = await prisma.driverRequests.create({
      data: {
        receiverId: requestData.receiverId,
        senderId: requestData.senderId,
        message: requestData.message,
      },
    });
    return { success: true, data: newRequest };
  } catch (error) {
    return { success: false, error: "Error creating driver request" };
  }
};

export const getDriverRequest = async (senderId: string, receiverId: string) => {
  try {
    const requests = await prisma.driverRequests.findMany({
      where: { senderId: senderId, receiverId: receiverId },
    });
    return { success: true, data: requests };
  } catch (error) {
    return { success: false, error: "Error retrieving driver request" };
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
