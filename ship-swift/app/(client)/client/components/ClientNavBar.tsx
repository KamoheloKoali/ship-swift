"use client";
import { useState } from "react";
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
import NavMenu from "@/screens/courier/dashboard/components/HeaderMenu";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function ClientNavBar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const menuItems = [{ label: "Messages", href: "/conversations" }];

  return (
    <header className="w-full bg-white mb-16">
      {/* Main Navigation */}
      <nav className="container mx-auto p-4">
        {/* Row 1: Logo and Navigation Menu for large screens */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Left side: Logo and Navigation Menu */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href={"/client"}>
              <div className="font-bold text-lg text-gray-800">Ship Swift</div>
            </Link>

            {/* Navigation Menu for larger screens */}
            <NavMenu items={menuItems} />
          </div>

          {/* Right side: Search Bar and User Button */}
          <div className="flex justify-end space-x-4 w-[20%]">
            {/* User Button (Clerk) */}
            <UserButton showName />
          </div>
        </div>

        {/* For Small Screens: Logo and Hamburger Menu */}
        <div className="flex items-center justify-between lg:hidden">
          <div className="flex items-center space-x-4">
            {/* Logo */}
          <UserButton userProfileMode="navigation" userProfileUrl="/profile" />
            <div className="font-bold text-lg text-gray-800">Ship Swift</div>
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
              <NavMenu items={menuItems} />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
