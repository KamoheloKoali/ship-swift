import type { Metadata } from "next";
import "@/app/globals.css";
import { checkDriverRole } from "@/actions/protectActions";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Header from "@/screens/courier/dashboard/components/Header";
import NotificationButton from "@/screens/notifications/PushNotifications/NotificationButton";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isDriver = await checkDriverRole(userId);

  if (!isDriver) {
    redirect("/");
  }

  return (
    <div>
      <Header />
      {children}
      <div className="fixed bottom-4 right-4">
        <NotificationButton />
      </div>
    </div>
  );
}
