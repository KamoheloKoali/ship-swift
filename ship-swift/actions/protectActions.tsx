"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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