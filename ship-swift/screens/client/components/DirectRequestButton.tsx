import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { getAllVerifiedDrivers } from "@/actions/driverActions";

interface Driver {
  Id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
}

interface DirectRequestButtonProps {
  onDriverSelected: (driverId: string) => void;
}

const DirectRequestButton: React.FC<DirectRequestButtonProps> = ({
  onDriverSelected,
}) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data } = await getAllVerifiedDrivers();
      if (data) {
        setDrivers(data);
      }
    };
    fetchDrivers();
  }, []);

  const handleDriverSelect = (driverId: string) => {
    onDriverSelected(driverId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="ml-2 border-black bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-md"
        >
          <User className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white border rounded-lg shadow-lg w-full max-w-sm md:max-w-lg overflow-y-auto max-h-72">
        {drivers.map((driver) => (
          <DropdownMenuItem
            key={driver.Id}
            className="flex items-center space-x-4 p-4 hover:bg-gray-100"
            onClick={() => handleDriverSelect(driver.Id)}
          >
            <img
              src={driver.photoUrl}
              alt={`${driver.firstName} ${driver.lastName}`}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col">
              <div className="font-medium truncate">{`${driver.firstName} ${driver.lastName}`}</div>
              <div className="text-sm text-gray-500 truncate">
                {driver.email}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DirectRequestButton;
