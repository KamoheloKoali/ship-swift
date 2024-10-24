import React, { useState, useEffect } from "react";
import { JobRequest } from "./JobsRequestsTable";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Clock,
  CheckCheck,
} from "lucide-react";
import { UserPlus, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { handleApply, handleApplied } from "./utils/jobRequests";
import { Skeleton } from "@/components/ui/skeleton";

interface JobsInfoProps {
  job: JobRequest | null;
  isOpen: boolean;
}

const CardJobsInfo: React.FC<JobsInfoProps> = ({ job, isOpen }) => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<
    "not_applied" | "applying" | "applied" | "error"
  >("not_applied");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkJobApplication = async () => {
      if (userId && job) {
        setLoading(true);
        try {
          const result = await handleApplied(userId);
          if (result.success) {
            const hasAlreadyApplied = result.data.some(
              (request) => request.CourierJob.Id === job.Id
            );
            setApplicationStatus(hasAlreadyApplied ? "applied" : "not_applied");
          } else {
            setApplicationStatus("error");
            setErrorMessage(
              result.error || "Failed to check application status"
            );
          }
        } catch (error) {
          console.error("Error checking job application:", error);
          setApplicationStatus("error");
          setErrorMessage("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    checkJobApplication();
  }, [userId, job]);

  const jobApply = async () => {
    if (userId && job?.Id) {
      setApplicationStatus("applying");
      try {
        const result = await handleApply(job.Id, userId);
        if (result.success) {
          setApplicationStatus("applied");
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error applying for job:", error);
        setApplicationStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to apply for job"
        );
      }
    }
  };

  const renderApplyButton = () => {
    switch (applicationStatus) {
      case "applying":
        return (
          <Button
            className="flex items-center justify-center space-x-2 border border-gray-500 bg-gray-100 text-gray-700 px-4 py-2 rounded-md my-2 cursor-not-allowed w-full"
            disabled
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Applying...</span>
          </Button>
        );
      case "applied":
        return (
          <div className="flex items-center justify-center space-x-2 border border-gray-500 bg-gray-100 text-gray-700 px-4 py-2 rounded-md my-2 cursor-not-allowed w-full">
            <CheckCheck className="w-4 h-4" />
            <span>Applied</span>
          </div>
        );
      case "error":
        return (
          <Button
            className="flex items-center justify-center space-x-2 border border-red-500 bg-red-100 text-red-700 px-4 py-2 rounded-md my-2 w-full"
            onClick={() => setApplicationStatus("not_applied")}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Error - Try Again</span>
          </Button>
        );
      case "not_applied":
        return (
          <Button
            className="flex items-center justify-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200 my-2 w-full"
            variant="outline"
            onClick={jobApply}
          >
            <CheckCheck className="w-4 h-4 text-black" />
            <span className="text-black">Apply</span>
          </Button>
        );
    }
  };

  if (!job) return null;

  if (loading) {
    return (
      <div className="p-4 min-h-screen flex items-center justify-center w-full h-full z-50">
        <Card className="w-full max-w-lg bg-white shadow-xl rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex flex-col w-full max-w-[200px]">
                <Skeleton className="h-10 w-full rounded-md mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = `${job.client.firstName} ${job.client.lastName}`;
  const initials = `${job.client.firstName.charAt(
    0
  )}${job.client.lastName.charAt(0)}`;
  return (
    <div className="p-4 min-h-screen flex items-center justify-center w-full h-full z-50">
      <Card className="w-full max-w-lg bg-white shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-gray-200">
                <AvatarImage
                  src={job.client.photoUrl || "/default-photo.jpg"}
                  alt={fullName}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {fullName}
                </h3>
                <p className="text-sm text-gray-500">Sender</p>
              </div>
            </div>
            <div className="flex flex-col">
              {renderApplyButton()}
              <Button
                className="flex items-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200 my-2"
                variant="outline"
              >
                <UserPlus className="w-4 h-4 text-black" />
                <span className="text-black">Connect</span>
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {job.Title}
            </h2>
            <p className="text-gray-600 text-sm">
              {job.Description || "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Pick Up</div>
                {job.PickUp || "No pickup location"}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Drop Off</div>
                {job.DropOff || "No dropoff location"}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Job Date</div>
                {job.collectionDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Package className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Parcel Size</div>
                {job.parcelSize || "Not specified"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Posted {job.dateCreated.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-bold text-gray-800">
                M{job.Budget || "0"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default CardJobsInfo;
