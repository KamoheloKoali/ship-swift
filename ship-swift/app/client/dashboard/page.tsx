import React from "react";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  const user = await currentUser();
  return <div>User: {user?.fullName}</div>;
}
