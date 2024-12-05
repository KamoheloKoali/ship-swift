"use server";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

// Separate the data fetching logic
const fetchUserRole = async (userId: string) => {
  const userRole = await prisma.userRole.findUnique({
    where: { userId },
  });

  if (userRole?.userId) {
    return { success: true, data: userRole };
  } else {
    return { success: false, error: "user role not found" };
  }
};

export const getUserRoleById = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    throw new Error("No user found or user ID is undefined");
  }

  // Cache the data fetch with the user ID as a key
  const getCachedUserRole = unstable_cache(
    async () => fetchUserRole(user.id),
    [`userRole-${user.id}`],
    { tags: ["userRole"], revalidate: false }
  );

  return getCachedUserRole();
};
