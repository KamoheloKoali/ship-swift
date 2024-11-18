"use server";
import { Prisma, PrismaClient } from "@prisma/client";

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
    await prisma.userRole.upsert({
      where: {
        userId: clientData.clerkId, // Assuming userId is a unique field
      },
      create: {
        userId: clientData.clerkId,
        driver: false,
        client: true,
      },
      update: {
        driver: false,
        client: true,
      },
    });
    if (newClient.Id) return { success: true, data: newClient };
    else return { success: false };
  } catch (error) {
    return { success: false, error: "Error creating client" + error };
  }
};

export const getUnverifiedClients = async () => {
  try {
    const unverifiedClients = await prisma.clients.findMany({
      where: {
        isVerified: false,
      },
    });
    if (unverifiedClients.length > 0) {
      return { success: true, data: unverifiedClients };
    } else {
      return { success: false, error: "No unverified clients found" };
    }
  } catch (error) {
    return {
      success: false,
      error: "Error retrieving unverified clients" + error,
    };
  }
};

export const verifyClient = async (clientId: string) => {
  try {
    const updatedClient = await prisma.clients.update({
      where: { Id: clientId },
      data: { isVerified: true },
    });
    if (updatedClient) {
      return { success: true, data: updatedClient };
    } else {
      return { success: false, error: "Client not found" };
    }
  } catch (error) {
    return { success: false, error: "Error updating client" + error };
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
      return { success: false, error: "Client not found" };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving client by ID" + error };
  }
};

export const getAllClients = async () => {
  const clients = await prisma.clients.findMany(); // Remove where clause to get all clients
  if (clients.length > 0) {
    return { success: true, data: clients };
  } else {
    return { success: false, error: "No clients found" };
  }
};

export const updateClient = async (
  clientId: string,
  clientData: Prisma.clientsUpdateInput
) => {
  try {
    const updatedClient = await prisma.clients.update({
      where: { Id: clientId },
      data: clientData,
    });
    return { success: true, data: updatedClient };
  } catch (error) {
    return { success: false, error: "Error updating client" + error };
  }
};

export const deleteClient = async (clientId: string) => {
  try {
    const deletedClient = await prisma.clients.delete({
      where: { Id: clientId },
    });
    return { success: true, data: deletedClient };
  } catch (error) {
    return { success: false, error: "Error deleting client" + error };
  }
};
