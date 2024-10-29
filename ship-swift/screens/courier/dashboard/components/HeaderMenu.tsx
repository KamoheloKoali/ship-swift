import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"; // Adjust the path as necessary
import LocationTracker from "@/screens/track-delivery/LocationTracker";
import { getUserRoleById } from "@/app/utils/getUserRole";

// Define the types for the menu items
type NavItem = {
  label: string;
  href?: string; // Optional if the item has a direct link
  dropdownItems?: {
    label: string;
    href: string;
  }[]; // Optional for dropdown items
};

interface NavMenuProps {
  items: NavItem[]; // Array of navigation items
}

const NavMenu: React.FC<NavMenuProps> = ({ items }) => {
  const updateLocation = async (lat: number, lng: number) => {
    // just here, doing nothing
  };
  const [isDriver, setIsDriver] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  useEffect(() => {
    const isDriver = async () => {
      const response = await getUserRoleById();
      if (response.data?.driver) {
        setIsDriver(true);
      }
    };
    isDriver();
  }, []);
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-col items-start lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
        {items.map((item, index) => (
          <NavigationMenuItem key={index} className="flex items-center">
            {item.dropdownItems ? (
              <>
                <NavigationMenuTrigger className="text-gray-800 hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white shadow-lg rounded-md p-4">
                  {item.dropdownItems.map((dropdownItem, idx) => (
                    <NavigationMenuLink
                      key={idx}
                      href={dropdownItem.href}
                      className="block px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      {dropdownItem.label}
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                href={item.href || "#"}
                className="text-gray-800 hover:bg-gray-100 p-2 rounded transition-colors duration-200"
              >
                {item.label}
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
        {isDriver && (
          <div className="hidden md:block">
            <LocationTracker updateLocation={updateLocation} />
          </div>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;
