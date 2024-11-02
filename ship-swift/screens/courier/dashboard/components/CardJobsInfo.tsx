import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JobRequest } from "./JobsRequestsTable";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ApplyButton from "./ApplyButton";
import RequestButton from "./RequestButton";
import { MapPin, Calendar, Package, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import {
  ApplicationStatus,
  checkJobApplication,
  formatClientName,
  formatDate,
  formatBudget,
  checkRequest,
} from "./utils/jobsInfo";
import CardJobsLoad from "./CardJobsLoad";
interface JobsInfoProps {
  job: JobRequest | null;
  isOpen: boolean;
}

interface RequestStatus {
  isPending: boolean;
  isAccepted: boolean;
}

const CardJobsInfo: React.FC<JobsInfoProps> = ({ job, isOpen }) => {
  const { userId } = useAuth();
  const router = useRouter();

  // State management
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus>("not_applied");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRequest, setIsRequest] = useState<boolean>(false);
  const [isRequestLoading, setIsRequestLoading] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>({
    isPending: false,
    isAccepted: false,
  });
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);
    
  // Effects
  useEffect(() => {
    const initializeJobApplication = async () => {
      if (userId && job) {
        setLoading(true);
        const result = await checkJobApplication(userId, job);
        setApplicationStatus(result.status);
        setErrorMessage(result.errorMessage);
        setLoading(false);
      }
    };

    initializeJobApplication();
  }, [userId, job]);

  useEffect(() => {
    let isSubscribed = true;

    const checkContactStatus = async () => {
      if (userId && job?.client.Id) {
        setIsRequestLoading(true);
        try {
          const status = await checkRequest(userId, job.client.Id);
          if (isSubscribed) {
            console.log("Setting request status:", status);
            setRequestStatus(status);
            setIsInitialCheckDone(true);
          }
        } catch (error) {
          console.error("Error checking request status:", error);
          if (isSubscribed) {
            setIsInitialCheckDone(true);
          }
        } finally {
          if (isSubscribed) {
            setIsRequestLoading(false);
          }
        }
      }
    };

    if (!isInitialCheckDone || (userId && job?.client.Id)) {
      checkContactStatus();
    }

    return () => {
      isSubscribed = false;
    };
  }, [userId, job?.client.Id, isInitialCheckDone]);

  // Render logic
  if (!job) return null;

  if (loading || isRequestLoading) {
    return <CardJobsLoad />;
  }

  const { fullName, initials } = formatClientName(
    job.client.firstName,
    job.client.lastName
  );

  return (
    <div className="p-4 flex items-center justify-center w-full h-full z-50">
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
              <ApplyButton
                jobId={job.Id}
                userId={userId || ""}
                applicationStatus={applicationStatus}
                setApplicationStatus={setApplicationStatus}
                setErrorMessage={setErrorMessage}
              />
              <RequestButton
                clientId={job.client.Id}
                userId={userId || ""}
                requestStatus={requestStatus}
                isInitialCheckDone={isInitialCheckDone}
                isRequestLoading={isRequestLoading}
                setIsRequestLoading={setIsRequestLoading}
                setRequestStatus={setRequestStatus}
              />
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
                {formatDate(job.collectionDate)}
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
                Posted {formatDate(job.dateCreated)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-bold text-gray-800">
                {formatBudget(job.Budget)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default CardJobsInfo;
