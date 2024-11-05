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

export default function Header() {
  const { userId } = useAuth();
  const [isDriver, setIsDriver] = useState(false);
  const [hasActiveJobs, setHasActiveJobs] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  useEffect(() => {
    const isDriver = async () => {
      const [response, activeJobs] = await Promise.all([
        getUserRoleById(),
        getAllActiveJobsByDriverId(userId || ""),
      ]);
      if (response.data?.driver && activeJobs && activeJobs?.length > 0) {
        setIsDriver(true);
        setHasActiveJobs(true);
      }
    };
    isDriver();
  }, []);
  const updateLocation = async (lat: number, lng: number, accuracy: number) => {
    const response = await createLocation({
      driverId: userId || "",
      latitude: lat,
      longitude: lng,
      accuracy: accuracy,
    });
    if (response.success) {
      console.log("Location created successfully");
    } else {
      console.log("Error creating location: " + response.error);
    }
  };

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
      dropdownItems: [
        { label: "Income", href: "/finances/income" },
        { label: "Expenses", href: "/finances/expenses" },
        { label: "Reports", href: "/finances/reports" },
      ],
    },
    { label: "Chats", href: "/conversations" },
  ];

  return (
    <header className="w-full bg-white mb-16">
      {/* Main Navigation */}
      <nav className="container mx-auto p-4 border border-red-500">
        {/* Row 1: Logo and Navigation Menu for large screens */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Left side: Logo and Navigation Menu */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="font-bold text-lg text-gray-800">Ship Swift</div>

            {/* Navigation Menu for larger screens */}
            <NavMenu
              items={menuItems}
              isDriver={isDriver}
              hasActiveJobs={hasActiveJobs}
            />
          </div>

          {/* Right side: Search Bar and User Button */}
          <div className="flex border border-red-500 justify-end w-[20%]  sm:hidden md:block">
            {/* User Button (Clerk) */}
            <UserButton />
          </div>
        </div>

        {/* For Small Screens: Logo and Hamburger Menu */}
        <div className="flex items-center justify-between lg:hidden border border-green-500">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="font-bold text-lg text-gray-800">Ship Swift</div>
            {isDriver && hasActiveJobs && (
              <div className="md:hidden">
                <LocationTracker updateLocation={updateLocation} />
              </div>
            )}
          </div>

          <div className="flex justify-end w-[20%]  sm:block lg:hidden">
            {/* User Button (Clerk) */}
            <UserButton />
          </div>

          {/* Menu Button for small screens */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="bg-white" onClick={() => setIsSheetOpen(true)}>
                <Bars3Icon className="h-6 w-6 text-gray-800" />
              </button>
            </SheetTrigger>

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
              />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
