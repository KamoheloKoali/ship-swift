"use client";
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useUser } from "@clerk/clerk-react";
import CardStatus from "@/screens/courier/dashboard/components/CardStatus";
import ProfileButton from "./ProfileButton";

interface UserProfileProps {
  onProfileClick: () => void;
  isProfileOpen: boolean;
  driverData: any; // Replace 'any' with a more specific type if you have one
}

const UserProfile: React.FC<UserProfileProps> = ({
  onProfileClick,
  isProfileOpen,
  driverData,
}) => {
  const { user } = useUser();

  // Fallback values in case driverData is not available
  const fullName = driverData
    ? `${driverData.firstName} ${driverData.lastName}`
    : user?.fullName || "Guest";
  const location = driverData?.location || "Location not available";

  return (
    <Card className="flex flex-row p-4 border border-gray-200 rounded-lg mb-12">
      <div className="flex flex-col items-center mr-4">
        <Avatar className="hidden md:block md:h-36 md:w-36 lg:h-48 lg:w-48 rounded-full border-2 border-gray-300">
          <img
            src={
              driverData?.photoUrl || user?.imageUrl || "/default-avatar.png"
            }
            alt={fullName}
            className="h-full w-full rounded-full object-cover"
          />
        </Avatar>
        <div className="mt-2 text-lg font-semibold">{fullName}</div>
        <div className="flex items-center">
          <LocationOnOutlinedIcon className="h-6 w-6 text-gray-800" />
          <span>{location}</span>
        </div>
      </div>

      <div className="flex flex-col items-end mylg:justify-center ml-auto">
        <div className="hidden md:block mylg:hidden justify-start">
          <CardStatus />
        </div>
        <ProfileButton onClick={onProfileClick} isProfileOpen={isProfileOpen} />
      </div>
    </Card>
  );
};

export default UserProfile;
