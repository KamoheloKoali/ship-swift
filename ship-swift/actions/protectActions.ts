"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * Checks if a user has a driver role
 * @param driverId - The ID of the user to check
 * @returns true if user has driver role, false otherwise
 */
export const checkDriverRole = async (driverId: string) => {
  try {
    const driver = await prisma.userRole.findUnique({
      where: {
        userId: driverId,
      },
    });
    if (driver?.driver === true) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error fetching driver role:", error);
    throw error;
  }
};

/**
 * Checks the roles of a user
 * @param userId - The ID of the user to check
 * @returns Object containing success status and role type ('client' or 'driver') or null if no role found
 */
export const checkRoles = async (userId: string) => {
  try {
    const user = await prisma.userRole.findUnique({
      where: {
        userId: userId,
      },
    });
    if (user?.client === true) {
      return {
        success: true,
        data: "client",
      };
    } else if (user?.driver === true) {
      return {
        success: true,
        data: "driver",
      };
    }
    return {
      success: false,
      data: null,
    };
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw error;
  }
};
