"use server"
import { currentUser } from "@clerk/nextjs/server";

export default async function getCurrentUserClerkDetails() {
  const user = await currentUser();

  return user;
}
