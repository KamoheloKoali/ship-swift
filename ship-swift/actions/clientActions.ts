import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createClient = async (clientData: {
  clerkId: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
}) => {
  try {
    const newClient = await prisma.clients.create({
      data: {
        Id: clientData.clerkId,
        email: clientData.email,
        phoneNumber: clientData.phoneNumber,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        photoUrl: clientData.photoUrl,
        idPhotoUrl: clientData.idPhotoUrl,
      },
    });
    return { success: true, data: newClient };
  } catch (error) {
    return { success: false, error: "Error creating client" };
  }
};

export const getClientById = async (clientId: string) => {
  try {
    const client = await prisma.clients.findUnique({
      where: { Id: clientId },
    });
    if (client) {
      return { success: true, data: client };
    } else {
      return { success: false, error: 'Client not found' };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving client by ID" };
  }
};

export const getClientByEmail = async (clientEmail: string) => {
  try {
    const client = await prisma.clients.findUnique({
      where: { email: clientEmail },
    });
    if (client) {
      return { success: true, data: client };
    } else {
      return { success: false, error: 'Client not found' };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving client by email" };
  }
};

export const updateClient = async (clientId: string, clientData: Partial<any>) => {
  try {
    const updatedClient = await prisma.clients.update({
      where: { Id: clientId },
      data: clientData,
    });
    return { success: true, data: updatedClient };
  } catch (error) {
    return { success: false, error: "Error updating client" };
  }
};

export const deleteClient = async (clientId: string) => {
  try {
    const deletedClient = await prisma.clients.delete({
      where: { Id: clientId },
    });
    return { success: true, data: deletedClient };
  } catch (error) {
    return { success: false, error: "Error deleting client" };
  }
};
