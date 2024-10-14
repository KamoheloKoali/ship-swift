import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { NavigationMenuDemo } from "@/screens/client-dashboard/NavBar";


export default async function Page() {
  const user = await currentUser();
  return <div className="flex justify-between">
  <h1 className="pl-5 w-[25%] text-3xl font-bold">Ship-Swift</h1>
  <div className="w-[75%]">
  <NavigationMenuDemo/>
  </div>
  </div>;
}
