"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card"; // Adjust the import path if necessary
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useUser } from "@clerk/clerk-react";

export default function UserProfile() {
  const { user, isLoaded, isSignedIn } = useUser();
  return (
    <Card className="flex flex-row p-4 border border-gray-200 rounded-lg">
      {/* Left Side: Avatar and Details */}
      <div className="flex flex-col items-center mr-4">
        <Avatar className="h-48 w-48 rounded-full border-2 border-gray-300">
          <img
            src="/path-to-your-avatar.jpg" // Replace with your avatar source
            alt="Khiba Koenane"
            className="h-full w-full rounded-full object-cover"
          />
        </Avatar>
        <div className="mt-2 text-lg font-semibold">
          {user ? user.fullName : "Guest"}
        </div>
        <div className="flex items-center">
          <LocationOnOutlinedIcon className="h-6 w-6 text-gray-800" />
          <span>Maseru, Lesotho</span>
        </div>
      </div>

      {/* Right Side: View Full Profile Button */}
      <div className="flex items-center ml-auto">
        <Button className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200">
          View Full Profile
        </Button>
      </div>
    </Card>
  );
}
