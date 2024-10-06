"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMessage = async (messageData: {
  driverId: string;
  clientId: string;
  message: string;
  senderId: string;
}) => {
  const newmessage = await prisma.messages.create({
    data: {
      driverId: messageData.driverId,
      clientId: messageData.clientId,
      senderId: messageData.senderId,
      message: messageData.message,
    },
  });
  if (newmessage.Id) return { success: true, data: newmessage };
  else return { success: false };
};

export const getMessages = async (clientId: string, driverId: string) => {
  try {
    const messages = await prisma.messages.findMany({
      where: { clientId: clientId, driverId: driverId },
    });
    if (messages.length > 0) return { success: true, data: messages };
  } catch (error) {
    return { success: false, error: "Error retrieving client message" };
  }
};

export const getMessageById = async (messageId: string) => {
  try {
    if (messageId.length > 0) {
      const messages = await prisma.messages.findMany({
        where: { Id: messageId },
      });
      if (messages.length > 0) return { success: true, data: messages };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving client messages" };
  }
};

export const updateMessage = async (
  messageId: string,
  messageData: Partial<any>
) => {
  try {
    const updatedmessage = await prisma.messages.update({
      where: { Id: messageId },
      data: messageData,
    });
    return { success: true, data: updatedmessage };
  } catch (error) {
    return { success: false, error: "Error updating client message" };
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    const deletedmessage = await prisma.messages.delete({
      where: { Id: messageId },
    });
    return { success: true, data: deletedmessage };
  } catch (error) {
    return { success: false, error: "Error deleting client message" };
  }
};
