import React from "react";
import { JobRequest } from "./JobsRequestsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobsInfoProps {
  job: JobRequest | null;
  isOpen: boolean;
}

const CardJobsInfo: React.FC<JobsInfoProps> = ({ job, isOpen }) => {
  if (!job) return null;

  return (
    <div className="px-4 py-6">
      <Card className="w-full max-w-sm mx-auto border-none bg-muted/80">
        <CardHeader>
          <CardTitle className="text-lg font-bold"></CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-start">
          {/* Your modal or popup implementation */}
          <h2>{job.name}</h2>
          <img src={job.profilePhoto} alt={job.name} />
          <p>Pickup: {job.pickUpLocation}</p>
          <p>Dropoff: {job.dropOffLocation}</p>
          <p>Job Date: {job.jobDate}</p>
          <p>Amount: {job.amount}</p>
          <p>Posted On: {job.postDate}</p>
          <p>Parcel Size: {job.parcelSize}</p>
          <p>Description: {job.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardJobsInfo;
