import type { Metadata } from "next";
import "@/app/globals.css";
import ClientNavBar from "./client/components/ClientNavBar";

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
