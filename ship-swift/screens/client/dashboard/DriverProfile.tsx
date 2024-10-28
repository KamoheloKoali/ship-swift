"use client";
import { Button } from "@/components/ui/button";
import {
  CheckCheck,
  CircleX,
  Loader2,
  MessageSquare,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@clerk/nextjs";
import { approveJobRequest } from "@/actions/jobRequestActions";

// interface Driver {
//     Id: string;
//     email: string;
//     phoneNumber?: string;
//     firstName: string;
//     lastName: string;
//     photoUrl: string;
//     idPhotoUrl: string;
//     vehicleType?: string;
//     dateCreated: Date;
//     dateUpdated: Date;
//     VIN?: string;
//     idNumber?: string;
//     licenseExpiry?: string;
//     licenseNumber?: string;
//     plateNumber?: string;
//     discExpiry?: string;
//     discPhotoUrl?: string;
//     licensePhotoUrl?: string;
//     location?: string;
//     isVerified: boolean;
//     Contacts: any[];         // You'll need to define these related types
//     driveRequests: any[];
//     Messages: any[];
//     clientRequests: any[];
//     JobRequests: any[];
//     Location: any[];
//     activeJobs: any[];
//   }

type Props = {
  driver: any;
  job: any;
};

const DriverProfile = ({ driver, job }: Props) => {
  const [isHired, setIsHired] = useState(false);
  const [isError, setIsError] = useState(false);
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const hire = async () => {
    setIsLoading(true);
    const response = await approveJobRequest({
      driverId: driver.Id,
      clientId: userId || "",
      courierJobId: job.Id,
    });
    if (response === "success") {
      setIsHired(true);
    } else {
      setIsError(true);
    }
    setIsLoading(false);
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
      <div className="flex justify-start mb-4 sm:mb-0">
        <Avatar>
          <AvatarImage src={driver.photoUrl} alt={driver.lastName} />
        </Avatar>
      </div>

      <div className="flex-grow space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h3 className="text-lg font-semibold">{`${driver.firstName} ${driver.lastName}`}</h3>
          <Badge variant="secondary" className="w-fit">
            Top Rated Plus
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            Professional Driver | 5+ Years Experience
          </p>
          <p className="text-sm text-gray-500">New York City</p>
        </div>

        <div className="">
          {isLoading ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2"
              disabled
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2"
                onClick={hire}
                disabled={isHired || isError}
              >
                {isHired ? (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    <span>Hired</span>
                  </>
                ) : isError ? (
                  <>
                    <CircleX className="h-4 w-4 text-red-500" />
                    <span>Please refresh and try again</span>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4" />
                    <span>Hire</span>
                  </>
                )}
              </Button>
              {isHired && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              )}
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">City Driving</Badge>
          <Badge variant="secondary">Highway Driving</Badge>
          <Badge variant="secondary">GPS Navigation</Badge>
          <Badge variant="secondary">Customer Service</Badge>
        </div>

        <p className="text-sm">
          Experienced driver with a perfect safety record. Specializing in
          efficient city and highway deliveries. Known for punctuality and
          excellent customer service.
        </p>
      </div>
    </div>
  );
};

export default DriverProfile;
