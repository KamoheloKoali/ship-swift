import React from "react";
import { JobRequest } from "./JobsRequestsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Package, DollarSign, Clock } from "lucide-react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobsInfoProps {
  job: JobRequest | null;
  isOpen: boolean;
}

const CardJobsInfo: React.FC<JobsInfoProps> = ({ job, isOpen }) => {
  if (!job) return null;

  return (
    <div className="p-4 min-h-screen flex items-center justify-center w-full h-full z-50">
      <Card className="w-full max-w-lg bg-white shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-gray-200">
                <AvatarImage
                  src="https://cdn.prod.website-files.com/5fd2ba952bcd68835f2c8254/654553fedbede7976b97eaf5_Professional-5.remini-enhanced.webp"
                  alt={job.name}
                />
                <AvatarFallback>{job.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {job.name}
                </h3>
                <p className="text-sm text-gray-500">Sender</p>
              </div>
            </div>
            <Button
              className="flex items-center space-x-2 border border-black bg-white hover:bg-gray-100 transition-colors duration-200"
              variant="outline"
            >
              <UserPlus className="w-4 h-4 text-black" />
              <span className="text-black">Contact</span>
            </Button>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{job.name}</h2>
            <p className="text-gray-600 text-sm">{job.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Pick Up</div>
                {job.pickUpLocation}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Drop Off</div>
                {job.dropOffLocation}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Job Date</div>
                {job.jobDate}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Package className="w-4 h-4" />
              <span className="text-sm">
                <div className="font-medium">Parcel Size</div>
                {job.parcelSize}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Posted {job.postDate}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-bold text-gray-800">{job.amount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardJobsInfo;
