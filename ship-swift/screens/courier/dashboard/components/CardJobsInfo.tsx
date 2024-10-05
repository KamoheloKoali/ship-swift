import React from "react";
import { JobRequest } from "./JobsRequestsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { MapPin, Calendar, Package, DollarSign, Clock } from "lucide-react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Divider from "@mui/material/Divider";

interface JobsInfoProps {
  job: JobRequest | null;
  isOpen: boolean;
}

const CardJobsInfo: React.FC<JobsInfoProps> = ({ job, isOpen }) => {
  if (!job) return null;

  return (
    <div className="p-4">
      <Card className="w-full max-w-md mx-auto border-none bg-muted/80 rounded-lg overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 pb-2 mb-6">
          <CardTitle className="text-xl font-bold text-gray-800">
            {job.name}
          </CardTitle>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Posted on {job.postDate}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex flex-row items-center justify-between mb-6">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 border-2 border-white shadow-md rounded-full mr-4 flex-shrink-0">
                <img
                  src={job.profilePhoto}
                  alt={job.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </Avatar>
              <div>
                <div className="font-semibold text-lg text-gray-800">
                  {job.name}
                </div>
                <div className="text-sm text-gray-600">Sender</div>
              </div>
            </div>
            <Button
              className="flex items-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200"
              variant="outline"
            >
              <UserPlus className="w-4 h-4 text-black" />
              <span className="text-black">Connect</span>
            </Button>
          </div>

          <Divider />

          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-gray-600" />
            <div>
              <div className="text-sm font-medium text-gray-500">Pick Up</div>
              <div className="text-md font-semibold text-gray-700 truncate">
                {job.pickUpLocation}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-gray-600" />
            <div>
              <div className="text-sm font-medium text-gray-500">Drop Off</div>
              <div className="text-md font-semibold text-gray-700 truncate">
                {job.dropOffLocation}
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Job Date
                </div>
                <div className="text-md font-semibold text-gray-700">
                  {job.jobDate}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-1 text-gray-600" />
              <div className="text-lg font-bold text-gray-800">
                {job.amount}
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-gray-600" />
            <div>
              <div className="text-sm font-medium text-gray-500">
                Parcel Size
              </div>
              <div className="text-md font-semibold text-gray-700">
                {job.parcelSize}
              </div>
            </div>
          </div>

          <Divider />

          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">
              Description
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {job.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardJobsInfo;
