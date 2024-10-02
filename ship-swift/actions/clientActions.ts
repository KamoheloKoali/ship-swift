import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createClient = async (clientData: {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
}) => {
  return await prisma.clients.create({
    data: {
      email: clientData.email,
      phoneNumber: clientData.phoneNumber,
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      photoUrl: clientData.photoUrl,
      idPhotoUrl: clientData.idPhotoUrl,
    },
  });
};


export const getClientById = async (clientId: string) => {
  return await prisma.clients.findUnique({
    where: { Id: clientId },
  });
};

export const updateClient = async (clientId: string, clientData: Partial<any>) => {
  return await prisma.clients.update({
    where: { Id: clientId },
    data: clientData,
  });
};

export const deleteClient = async (clientId: string) => {
  return await prisma.clients.delete({
    where: { Id: clientId },
  });
};