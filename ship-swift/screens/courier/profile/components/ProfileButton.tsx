"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface ProfileButtonProps {
  onClick: () => void;
  isProfileOpen: boolean;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
  onClick,
  isProfileOpen,
}) => {
  return (
    <div>
      <Button
        className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
        onClick={onClick}
      >
        {isProfileOpen ? "Minimize" : "Full Profile"}
      </Button>
    </div>
  );
};

export default ProfileButton;
