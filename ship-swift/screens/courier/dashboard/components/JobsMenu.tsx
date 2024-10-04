import React from "react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
const JobsMenu = () => {
  const [activeTab, setActiveTab] = useState("mostRecent");
  return (
    <div className="mb-8">
      <NavigationMenu className="w-full">
        <NavigationMenuList className="flex items-center justify-start space-x-6 whitespace-nowrap">
          {/* Most Recent Tab */}
          <NavigationMenuItem>
            <NavigationMenuLink
              onClick={() => setActiveTab("mostRecent")}
              className={`hover:text-black py-2 cursor-pointer font-medium ${
                activeTab === "mostRecent"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
            >
              Most Recent
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Highest Paying Tab */}
          <NavigationMenuItem>
            <NavigationMenuLink
              onClick={() => setActiveTab("highestPaying")}
              className={`hover:text-black px-4 py-2 cursor-pointer font-medium ${
                activeTab === "highestPaying"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
            >
              Highest Paying
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* My Area Tab */}
          <NavigationMenuItem>
            <NavigationMenuLink
              onClick={() => setActiveTab("myArea")}
              className={`hover:text-black px-4 py-2 cursor-pointer font-medium ${
                activeTab === "myArea"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
            >
              My Area
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default JobsMenu;
