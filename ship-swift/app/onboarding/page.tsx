"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Truck, User } from "lucide-react";
import RegHeader from "@/screens/courier/registration/components/RegHeader";
import { getDriverByID } from "@/actions/driverActions";
import { getClientById } from "@/actions/clientActions";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const user = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // router.push("/client/dashboard/deliver");
    const checkUser = async () => {
      if (!user || !user.userId) {
        setIsLoading(false);
        return;
      } // Guard clause to wait for user data
      const [responseFromDriverTable, responseFromClientTable] =
        await Promise.all([
          getDriverByID(user.userId),
          getClientById(user.userId),
        ]);

      if (responseFromDriverTable && !responseFromClientTable.success) {
        router.push("/driver/dashboard/find-jobs");
      } else if (
        responseFromClientTable.success &&
        !responseFromDriverTable?.idNumber
      ) {
        console.log(
          "Client is not a courier:  redirecting to client dashboard " +
            responseFromClientTable.data?.Id
        );
        router.push("/client");
      } else {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [user]); // Add `user` to the dependency array

  return (
    <>
      {isLoading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div>
            <RegHeader />
          </div>
          <div className="flex flex-col lg:flex-row sm:flex-col justify-center items-center p-6 sm:p-2 lg:p-12 space-y-6 lg:space-y-0 lg:space-x-6 min-h-screen bg-slate-300">
            {/* Client Card */}
            <Card className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-4">
                <User className="text-black" size="32" />
                <CardTitle className="text-xl sm:text-2xl font-bold text-center">
                  I am a client
                </CardTitle>
              </div>
              <p className="text-gray-500 text-center mb-6">
                Looking for a reliable service? Apply as a client today!
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={"/onboarding/client-onboarding"}
                      passHref
                      className="w-full m-4"
                    >
                      <Button className=" w-full text-white font-semibold rounded-lg">
                        Apply
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to apply as a client</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Card>

            {/* Courier Card */}
            <Card className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Truck className="text-black" size="32" />
                <CardTitle className="text-xl sm:text-2xl font-bold text-center">
                  I am a courier
                </CardTitle>
              </div>
              <p className="text-gray-500 text-center mb-6">
                Ready to deliver packages? Apply as a courier now!
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={"/onboarding/driver-onboarding/registration"}
                      passHref
                      className="w-full m-4"
                    >
                      <Button className="w-full text-white font-semibold rounded-lg">
                        Apply
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to apply as a courier</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
