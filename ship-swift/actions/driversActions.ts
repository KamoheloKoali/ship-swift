import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDriver = async (userData: {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
  vehicleType: string;
  vehicleDetails: string[];
}) => {
  return await prisma.drivers.create({
    data: {
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      firstName: userData.firstName,
      lastName: userData.lastName,
      photoUrl: userData.photoUrl,
      idPhotoUrl: userData.idPhotoUrl,
      vehicleType: userData.vehicleType,
      vehicleDetails: userData.vehicleDetails,
    },
  });
};


export const getUserById = async (userId: string) => {
  return await prisma.drivers.findUnique({
    where: { Id: userId },
  });
};

export const updateUser = async (userId: string, userData: Partial<any>) => {
  return await prisma.drivers.update({
    where: { Id: userId },
    data: userData,
  });
};

export const deleteUser = async (userId: string) => {
  return await prisma.drivers.delete({
    where: { Id: userId },
  });
};