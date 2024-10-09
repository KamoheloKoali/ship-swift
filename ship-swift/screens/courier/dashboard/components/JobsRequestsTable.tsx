"use client";
import React, { useState } from "react";
import JobsRequests from "./JobsRequests";
export interface JobRequest {
  profilePhoto: string;
  name: string;
  pickUpLocation: string;
  dropOffLocation: string;
  jobDate: string;
  amount: string;
  postDate: string;
  parcelSize?: string;
  description?: string;
}

// Sample job requests data
const jobRequestsData: JobRequest[] = [
  {
    profilePhoto: "https://cdn.prod.website-files.com/5fd2ba952bcd68835f2c8254/654553fedbede7976b97eaf5_Professional-5.remini-enhanced.webp",
    name: "John Doe",
    pickUpLocation: "123 Main St",
    dropOffLocation: "456 Elm St",
    jobDate: "Tue, 10-10-2024",
    amount: "M50",
    postDate: "Wed, 02-10-2024",
    parcelSize: "Medium",
    description:
      "Deliver a medium-sized package to the given address. Recipient will be available after 3 PM.",
  },
  {
    profilePhoto: "https://cdn.prod.website-files.com/5fd2ba952bcd68835f2c8254/654553fedbede7976b97eaf5_Professional-5.remini-enhanced.webp",
    name: "Jane Smith",
    pickUpLocation: "789 Maple Ave",
    dropOffLocation: "101 Pine Rd",
    jobDate: "Wed, 11-10-2024",
    amount: "M75",
    postDate: "Tue, 01-10-2024",
    parcelSize: "Large",
    description:
      "Transport large furniture items carefully. Lift assistance required for heavy items.",
  },
  {
    profilePhoto: "https://cdn.prod.website-files.com/5fd2ba952bcd68835f2c8254/654553fedbede7976b97eaf5_Professional-5.remini-enhanced.webp",
    name: "Sasuke Uchiha",
    pickUpLocation: "Main North 1 Rd Maseru Lesotho",
    dropOffLocation: "456 Elm St",
    jobDate: "Tue, 06-10-2024",
    amount: "M60",
    postDate: "Wed, 04-10-2024",
    parcelSize: "Small",
    description:
      "Deliver important documents to the specified address. Documents should not be bent or damaged.",
  },
];

interface JobsRequestsTableProps {
  sortType: string;
  onJobSelect: (job: JobRequest | null) => void;
}

const JobsRequestsTable: React.FC<JobsRequestsTableProps> = ({
  sortType,
  onJobSelect,
}) => {
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);

  const sortedData = [...jobRequestsData].sort((a, b) => {
    if (sortType === "mostRecent") {
      return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
    } else if (sortType === "highestPaying") {
      return parseFloat(b.amount.slice(1)) - parseFloat(a.amount.slice(1));
    }
    return 0;
  });

  const handleJobClick = (job: JobRequest) => {
    setSelectedJob(job);
    onJobSelect(job);
  };

  return (
    <div className="py-4">
      <div className="flex flex-col">
        {sortedData.map((request, index) => (
          <div
            key={index}
            onClick={() => handleJobClick(request)}
            className={`cursor-pointer transition-colors ${
              selectedJob === request ? "bg-muted/80" : ""
            }`}
          >
            <JobsRequests
              {...request}
              isSelected={selectedJob === request}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsRequestsTable;
