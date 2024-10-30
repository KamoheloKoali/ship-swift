import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  ApplicationStatus,
  checkJobApplication,
  applyForJob,
  formatClientName,
  formatDate,
  formatBudget,
  checkContact,
  createContact,
  messageContact,
} from "./utils/jobsInfo";
import CardJobsLoad from "./CardJobsLoad";

interface JobsInfoProps {
  job: JobRequest | null;
  isOpen: boolean;
}

const CardJobsInfo: React.FC<JobsInfoProps> = ({ job, isOpen }) => {
  const router = useRouter();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus>("not_applied");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isContact, setIsContact] = useState<boolean>(false);
  const [isContactLoading, setIsContactLoading] = useState<boolean>(false);
  const [isMessaging, setIsMessaging] = useState<boolean>(false);

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

  const jobApply = async () => {
    if (userId && job?.Id) {
      setApplicationStatus("applying");
      const result = await applyForJob(job.Id, userId);
      setApplicationStatus(result.status);
      setErrorMessage(result.errorMessage);
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

  useEffect(() => {
    const checkContactStatus = async () => {
      if (userId && job?.client.Id) {
        setIsContactLoading(true);
        try {
          const hasContact = await checkContact(job.client.Id, userId);
          setIsContact(hasContact.success);
        } catch (error) {
          console.error("Error checking contact status:", error);
        } finally {
          setIsContactLoading(false);
        }
      }
    };

    checkContactStatus();
  }, [userId, job?.client.Id]);

  const handleCreateContact = async () => {
    if (userId && job?.client.Id) {
      setIsContactLoading(true);
      try {
        const result = await createContact(userId, job.client.Id);
        if (result) {
          setIsContact(true);
        }
      } catch (error) {
        console.error("Error creating contact:", error);
      } finally {
        setIsContactLoading(false);
      }
    }
  };

  const handleMessage = async () => {
    if (userId && job?.client.Id) {
      setIsMessaging(true);
      try {
        const conversationId = await messageContact(job.client.Id, userId);
        console.log("Conversation ID:", conversationId);

        if (conversationId) {
          router.push(`/conversations/${conversationId}`);
        } else {
          console.error("No conversation ID was returned");
        }
      } catch (error) {
        console.error("Error navigating to conversation:", error);
      } finally {
        setIsMessaging(false);
      }
    } else {
      console.warn("Missing user or client ID");
    }
  };

  const renderContactButton = () => {
    if (isContactLoading) {
      return (
        <Button
          className="flex items-center space-x-2 border border-gray-500 bg-gray-100 text-gray-700 px-4 py-2 rounded-md my-2 cursor-not-allowed"
          disabled
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </Button>
      );
    }

    if (isContact) {
      return (
        <Button
          className="flex text-black items-center justify-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200 my-2 w-full"
          onClick={handleMessage}
        >
          <CheckCheck className="w-4 h-4" />
          <span>Message</span>
        </Button>
      );
    }

    return (
      <Button
        className="flex items-center justify-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200 my-2 w-full"
        variant="outline"
        onClick={handleCreateContact}
      >
        <UserPlus className="w-4 h-4 text-black" />
        <span className="text-black">Connect</span>
      </Button>
    );
  };

  if (!job) return null;

  if (loading || isContactLoading || isMessaging) {
    return <CardJobsLoad />;
  }

  const { fullName, initials } = formatClientName(
    job.client.firstName,
    job.client.lastName
  );

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
              {renderContactButton()}
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
