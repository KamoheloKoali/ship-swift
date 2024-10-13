import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Truck, User } from "lucide-react";

const Page = () => {
  return (
    <div className="flex flex-col xlg:flex-row sm:flex-col items-center border border-gray-300 shadow-lg rounded-lg p-8 justify-center space-y-6 xlg:space-y-0 xlg:space-x-6 bg-gray-50">
      {/* Client Card */}
      <Card className="p-8 flex flex-col items-center justify-center sm:m-2 w-full max-w-sm bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
        <div className="flex items-center space-x-3 mb-4">
          <User className="text-blue-600" size="32" />
          <CardTitle className="text-2xl font-bold">I am a client</CardTitle>
        </div>
        <p className="text-gray-500 text-center mb-6">Looking for a reliable service? Apply as a client today!</p>
        <TooltipProvider>
        <Tooltip content="Click to apply as a client">
 
          <Button className="m-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg">
            Apply
          </Button>
        </Tooltip>
        </TooltipProvider>
      </Card>

      {/* Courier Card */}
      <Card className="p-8 flex flex-col items-center justify-center sm:m-2 w-full max-w-sm bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Truck className="text-green-600" size="32" />
          <CardTitle className="text-2xl font-bold">I am a courier</CardTitle>
        </div>
        <p className="text-gray-500 text-center mb-6">Ready to deliver packages? Apply as a courier now!</p>
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
