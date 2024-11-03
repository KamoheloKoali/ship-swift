import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Ship-swift",
  description: "Ship purcels swiftly",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
}