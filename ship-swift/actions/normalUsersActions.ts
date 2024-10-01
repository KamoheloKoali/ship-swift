import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (userData: {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
}) => {
  return await prisma.users.create({
    data: {
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      firstName: userData.firstName,
      lastName: userData.lastName,
      photoUrl: userData.photoUrl,
      idPhotoUrl: userData.idPhotoUrl,
    },
  });
};


export const getUserById = async (userId: string) => {
  return await prisma.users.findUnique({
    where: { Id: userId },
  });
};

export const updateUser = async (userId: string, userData: Partial<any>) => {
  return await prisma.users.update({
    where: { Id: userId },
    data: userData,
  });
};

export const deleteUser = async (userId: string) => {
  return await prisma.users.delete({
    where: { Id: userId },
  });
};