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

interface JobsMenuProps {
  onSortChange: (sortType: string) => void; // Define the type for onSortChange
}

const JobsMenu: React.FC<JobsMenuProps> = ({ onSortChange }) => {
  const [activeTab, setActiveTab] = useState<string>("mostRecent");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSortChange = (sortType: string) => {
    setActiveTab(sortType);
    onSortChange(sortType);

    if (sortType === "searchLocation") {
      setShowSearchBar(!showSearchBar);
    } else {
      setShowSearchBar(false);
    }
  };

  const renderNavItem = (label: string, sortType: string) => (
    <NavigationMenuItem>
      <NavigationMenuLink
        onClick={() => handleSortChange(sortType)}
        className={`hover:text-black py-2 cursor-pointer font-medium ${
          activeTab === sortType
            ? "text-black border-b-2 border-black"
            : "text-gray-500"
        }`}
      >
        {label}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );

  return (
    <div className="mb-8">
      <NavigationMenu className="w-full">
        <NavigationMenuList className="flex items-center justify-start space-x-6 whitespace-nowrap">
          {renderNavItem("Most Recent", "mostRecent")}
          {renderNavItem("Highest Paying", "highestPaying")}

          <NavigationMenuItem className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              {renderNavItem("Search Location", "searchLocation")}
              {/* <div className="md:hidden ml-2">
                <Search
                  className="cursor-pointer text-gray-500 hover:text-black"
                  onClick={() => setShowSearchBar(!showSearchBar)}
                />
              </div> */}
            </div>

            {activeTab === "searchLocation" && (
              <div className="hidden md:flex items-center ml-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-2 py-1 w-48"
                />
              </div>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Search bar for smaller screens */}
      {showSearchBar && activeTab === "searchLocation" && (
        <div className="relative block md:hidden mt-4 w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
            onClick={() => {
              setSearchTerm("");
              setShowSearchBar(false);
            }}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsMenu;
