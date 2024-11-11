// "use client"
import "@/app/globals.css";
import ClientNavBar from "./client/components/ClientNavBar";
import { Truck } from "lucide-react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ClientNavBar />
      {children}
    </div>
  );
}
