"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import NavMenu from "./HeaderMenu";
import { Bars3Icon } from "@heroicons/react/24/outline";
import LocationTracker from "@/screens/track-delivery/LocationTracker";
import { createLocation } from "@/actions/locationAction";
import { useAuth } from "@clerk/nextjs";
import { getUserRoleById } from "@/app/utils/getUserRole";
import { getAllActiveJobsByDriverId } from "@/actions/activeJobsActions";
import NotificationFeed from "@/screens/notifications/InApp/NotificationFeed";
import SwitchUser from "@/screens/global/switch-user";

export default function Header() {
  const { userId } = useAuth();
  const [isDriver, setIsDriver] = useState(false);
  const [hasActiveJobs, setHasActiveJobs] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // useEffect(() => {
  //   const isDriver = async () => {
  //     const response = await getUserRoleById();
  //     if (response.data?.driver) {
  //       setIsDriver(true);
  //     }
  //   };
  //   isDriver();
  // }, []);
  // const updateLocation = async (lat: number, lng: number, accuracy: number) => {
  //   const response = await createLocation({
  //     driverId: userId || "",
  //     latitude: lat,
  //     longitude: lng,
  //     accuracy: accuracy,
  //   });
  //   if (response.success) {
  //     console.log("Location created successfully");
  //   } else {
  //     console.log("Error creating location: " + response.error);
  //   }
  // };

  const handleCloseSheet = () => setIsSheetOpen(false);

  const menuItems = [
    {
      label: "Find Jobs",
      href: "/driver/dashboard/find-jobs",
    },
    {
      label: "My Jobs",
      href: "/driver/dashboard/my-jobs",
    },
    {
      label: "Manage Finances",
      href: "/finances",
    },
    { label: "Chats", href: "/conversations" },
  ];

  return (
    <header className="w-full bg-white mb-16">
      <nav className="container mx-auto p-4 border-b-2 border-slate-200">
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center space-x-4 ">
            {/* Logo */}
            <div className="font-bold text-lg text-gray-800">Ship Swift</div>

            {/* Navigation Menu for larger screens */}
            <NavMenu
              items={menuItems}
              isDriver={isDriver}
              hasActiveJobs={hasActiveJobs}
            />
          </div>
          {/* User Button (Clerk) - Only visible on large screens */}
          <div className="flex gap-2">
            <SwitchUser />
            <NotificationFeed />
            <UserButton />
          </div>
        </div>

        {/* For Small Screens: Logo and Hamburger Menu */}
        <div className="flex items-center justify-between lg:hidden">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="font-bold text-lg text-gray-800 flex gap-2">
              Ship Swift
            </div>
            {/* {isDriver && (
              <div className="">
                <LocationTracker updateLocation={updateLocation} />
              </div>
            )} */}
          </div>
          {/* Menu Button for small screens */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <div className="flex gap-2">
              <NotificationFeed />
              <SheetTrigger asChild>
                <button
                  className="bg-white"
                  onClick={() => setIsSheetOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6 text-gray-800" />
                </button>
              </SheetTrigger>
            </div>

            {/* Sheet Content */}
            <SheetContent side="left" className="bg-white p-4">
              <SheetHeader className="items-start p-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              {/* Navigation Menu in Sheet */}
              <NavMenu
                items={menuItems}
                isDriver={isDriver}
                hasActiveJobs={hasActiveJobs}
                onClose={handleCloseSheet}
              />

              {/* User Button (Clerk) - Only visible on small screens in Sheet */}
              <div className="lg:hidden flex justify-between p-3 rounded-sm bg-slate-200">
                <p>Account</p>
                <UserButton />
              </div>
              <div className="mt-4">
                <SwitchUser />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
