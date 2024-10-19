"use client";
import React, { useState } from "react";
import JobsRequests from "./JobsRequests";
import { getAllJobs } from "@/actions/courierJobsActions";
import { useEffect } from "react";

interface Client {
  Id: string;
  dateCreated: Date;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
  dateUpdated: Date;
}

// Update the interface to match your Prisma schema
export interface JobRequest {
  Id: string;
  Title: string | null;
  Description: string | null;
  Budget: string | null;
  PickUp: string | null;
  DropOff: string | null;
  parcelSize: string | null;
  collectionDate: Date;
  dateCreated: Date;
  client: Client;
}

// Define the response type from your getAllJobs action
interface JobsResponse {
  success: boolean;
  data?: JobRequest[];
  error?: string;
}

interface JobsRequestsTableProps {
  sortType: string;
  onJobSelect: (job: JobRequest | null) => void;
}

const JobsRequestsTable: React.FC<JobsRequestsTableProps> = ({
  sortType,
  onJobSelect,
}) => {
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result: JobsResponse = await getAllJobs();
        if (result.success && result.data) {
          setJobs(result.data);
        } else {
          setError(result.error || "Failed to fetch jobs");
        }
      } catch (err) {
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const sortedData = [...jobs].sort((a, b) => {
    if (sortType === "mostRecent") {
      return (
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      );
    } else if (sortType === "highestPaying") {
      return parseFloat(b.Budget || "0") - parseFloat(a.Budget || "0");
    }
    return 0;
  });

  const handleJobClick = (job: JobRequest) => {
    setSelectedJob(job);
    onJobSelect(job);
  };

  if (loading) {
    return <div className="py-4">Loading...</div>;
  }

  if (error) {
    return <div className="py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="py-4">
      <div className="flex flex-col">
        {sortedData.map((job) => (
          <div
            key={job.Id}
            onClick={() => handleJobClick(job)}
            className={`cursor-pointer transition-colors ${
              selectedJob?.Id === job.Id ? "bg-muted/80" : ""
            }`}
          >
            <JobsRequests
              profilePhoto={job.client.photoUrl || "/default-photo.jpg"}
              name={`${job.client.firstName} ${job.client.lastName}`}
              pickUpLocation={job.PickUp || "No pickup location"}
              dropOffLocation={job.DropOff || "No dropoff location"}
              jobDate={job.collectionDate.toLocaleDateString()}
              amount={`M${job.Budget || "0"}`}
              postDate={job.dateCreated.toLocaleDateString()}
              parcelSize={job.parcelSize || "Not specified"}
              description={job.Description || "No description provided"}
              isSelected={selectedJob?.Id === job.Id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsRequestsTable;
