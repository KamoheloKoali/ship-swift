import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"; // Adjust the path as necessary

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
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;
