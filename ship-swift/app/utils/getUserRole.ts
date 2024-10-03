"use server";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserRoleById = async () => {
    const user = await currentUser();
    if (!user || !user.id) {
        throw new Error("No user found or user ID is undefined");
      }
      const userRole = await prisma.userRole.findUnique({
        where: { userId: user?.id },
      });
      if (userRole?.userId) {
        return { success: true, data: userRole };
      } else {
        return { success: false, error: "user role not found" };
      }
  };

  