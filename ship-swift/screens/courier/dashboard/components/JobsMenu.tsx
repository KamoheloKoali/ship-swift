import React from "react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Search, X, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChevronDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JobsMenuProps {
  onSortChange: (sortType: string) => void;
}

const JobsMenu: React.FC<JobsMenuProps> = ({ onSortChange }) => {
  const [activeTab, setActiveTab] = useState<string>("mostRecent");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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

  const renderMobileMenuItem = (label: string, sortType: string) => (
    <DropdownMenuItem onSelect={() => handleSortChange(sortType)}>
      {label}
    </DropdownMenuItem>
  );

  return (
    <div className="mb-8">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="flex flex-wrap items-center justify-start space-x-4 space-y-2 sm:space-y-0">
            {renderNavItem("Most Recent", "mostRecent")}
            {renderNavItem("Highest Paying", "highestPaying")}
            {renderNavItem("Search Location", "searchLocation")}

            {activeTab === "searchLocation" && (
              <NavigationMenuItem className="flex items-center ml-2 flex-grow">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <ChevronDown className="h-5 w-5" /> <p>Filter</p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {renderMobileMenuItem("Most Recent", "mostRecent")}
              {renderMobileMenuItem("Highest Paying", "highestPaying")}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="relative mt-4">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-8"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => {
                setSearchTerm("");
                setShowMobileSearch(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsMenu;
