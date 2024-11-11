"use server"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserRole{
  userId: string;
  driver?: boolean;
  client?: boolean;
}

export const createUserRole = async ({ userId, driver = false, client = false }: UserRole) => {
  try {
    const userRole = await prisma.userRole.create({
      data: {
        userId,
        driver,
        client,
      },
    });
    return userRole;
  } catch (error) {
    console.error('Error creating user role:', error);
    throw error;
  }
};

export const updateUserRole = async ({ userId, driver, client }: UserRole) => {
  try {
    const updatedUserRole = await prisma.userRole.update({
      where: { userId },
      data: {
        driver,
        client,
      },
    });
    return updatedUserRole;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const getUserRole = async (userId: string) => {
  try {
    const userRole = await prisma.userRole.findUnique({
      where: { userId },
    });
    return userRole;
  } catch (error) {
    console.error('Error retrieving user role:', error);
    throw error;
  }
};

export const deleteUserRole = async (userId: string) => {
  try {
    const deletedUserRole = await prisma.userRole.delete({
      where: { userId },
    });
    return deletedUserRole;
  } catch (error) {
    console.error('Error deleting user role:', error);
    throw error;
  }
};
