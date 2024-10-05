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
    profilePhoto: "/path-to-profile-photo1.jpg",
    name: "John Doe",
    pickUpLocation: "123 Main St",
    dropOffLocation: "456 Elm St",
    jobDate: "Tue, 10-10-2024",
    amount: "M50",
    postDate: "Wed, 02-10-2024",
    parcelSize: "Medium",
    description: "Deliver a medium-sized package to the given address. Recipient will be available after 3 PM.",
  },
  {
    profilePhoto: "/path-to-profile-photo2.jpg",
    name: "Jane Smith",
    pickUpLocation: "789 Maple Ave",
    dropOffLocation: "101 Pine Rd",
    jobDate: "Wed, 11-10-2024",
    amount: "M75",
    postDate: "Tue, 01-10-2024",
    parcelSize: "Large",
    description: "Transport large furniture items carefully. Lift assistance required for heavy items.",
  },
  {
    profilePhoto: "/path-to-profile-photo3.jpg",
    name: "Sasuke Uchiha",
    pickUpLocation: "Main North 1 Rd Maseru Lesotho",
    dropOffLocation: "456 Elm St",
    jobDate: "Tue, 06-10-2024",
    amount: "M60",
    postDate: "Wed, 04-10-2024",
    parcelSize: "Small",
    description: "Deliver important documents to the specified address. Documents should not be bent or damaged.",
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
  console.log("Rendering JobsRequestsTable with sortType:", sortType);
  const sortedData = [...jobRequestsData].sort((a, b) => {
    if (sortType === "mostRecent") {
      return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
    } else if (sortType === "highestPaying") {
      return parseFloat(b.amount.slice(1)) - parseFloat(a.amount.slice(1));
    }
    return 0;
  });

  return (
    <div className="py-4">
      <div className="flex flex-col">
        {sortedData.map((request, index) => (
          <div
            key={index}
            onClick={() => onJobSelect(request)}
            className="cursor-pointer"
          >
            <JobsRequests
              profilePhoto={request.profilePhoto}
              name={request.name}
              pickUpLocation={request.pickUpLocation}
              dropOffLocation={request.dropOffLocation}
              jobDate={request.jobDate}
              amount={request.amount}
              postDate={request.postDate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsRequestsTable;
