"use client";
import "@/app/globals.css";
import ClientNavBar from "./client/components/ClientNavBar";
import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { getUserRoleById } from "../utils/getUserRole";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChecking, setIsChecking] = useState(true);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    const checkUserRole = async () => {
      const userRole = await getUserRoleById();
      if (userRole.data?.client) {
        setIsClient(true);
      }
      setIsChecking(false);
    };
    checkUserRole();
  }, []);
  return (
    <div>
      {isChecking && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md">
          {/* Animated Delivery Truck */}
          <Truck className="animate-truck" width="100" height="100" />
          <p className="text-lg text-gray-700">____________________</p>
        </div>
      )}
      {isClient ? (
        <>
          <ClientNavBar />
          {children}
        </>
      ) : (
        <div className="w-screen h-screen flex justify-center items-center">
          Only clients allowed here
        </div>
      )}
    </div>
  );
}
