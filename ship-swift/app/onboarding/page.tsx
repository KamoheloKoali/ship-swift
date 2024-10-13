import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
} from "@/components/ui/card";

import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Truck, User } from "lucide-react";

const Page = () => {
  return (
    <div className="flex flex-col lg:flex-row sm:flex-col items-center lg:items-start border border-gray-300 shadow-lg rounded-lg p-6 sm:p-8 lg:p-12 justify-center space-y-6 lg:space-y-0 lg:space-x-6 bg-gray-50">
      {/* Client Card */}
      <Card className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-4">
          <User className="text-blue-600" size="32" />
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            I am a client
          </CardTitle>
        </div>
        <p className="text-gray-500 text-center mb-6">
          Looking for a reliable service? Apply as a client today!
        </p>
        <TooltipProvider>
          <Tooltip content="Click to apply as a client">
            <Button className="m-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg">
              Apply
            </Button>
          </Tooltip>
        </TooltipProvider>
      </Card>

      {/* Courier Card */}
      <Card className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-4">
          <Truck className="text-green-600" size="32" />
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            I am a courier
          </CardTitle>
        </div>
        <p className="text-gray-500 text-center mb-6">
          Ready to deliver packages? Apply as a courier now!
        </p>
        <TooltipProvider>
          <Tooltip content="Click to apply as a courier">
            <Button className="m-4 w-full bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg">
              Apply
            </Button>
          </Tooltip>
        </TooltipProvider>
      </Card>
    </div>
  );
};

export default Page;
