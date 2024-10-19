import React from "react";
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
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { createJobRequest } from "@/actions/jobRequestActions";
import { handleApply } from "./utils/jobRequests";

interface JobsInfoProps {
  job: JobRequest | null;
  isOpen: boolean;
}

const CardJobsInfo: React.FC<JobsInfoProps> = ({ job, isOpen }) => {
  const { userId } = useAuth();
  if (!job) return null;

  const fullName = `${job.client.firstName} ${job.client.lastName}`;
  const initials = `${job.client.firstName.charAt(
    0
  )}${job.client.lastName.charAt(0)}`;

  const jobApply = async () => {
    await handleApply(job.Id, userId ?? null);
  };

  if (jobApply)

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
              <Button
                className="flex items-center justify-start space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200 my-2"
                variant="outline"
                onClick={jobApply}
              >
                <CheckCheck className="w-4 h-4 text-black" />
                <span className="text-black">Apply</span>
              </Button>
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
