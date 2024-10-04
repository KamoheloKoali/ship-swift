import React from "react";
import JobsRequests from "./JobsRequests"; // Adjust the path as necessary

interface JobRequest {
  profilePhoto: string;
  name: string;
  pickUpLocation: string;
  dropOffLocation: string;
  jobDate: string;
  amount: string;
  postDate: string;
}

const jobRequestsData: JobRequest[] = [
  {
    profilePhoto: "/path-to-profile-photo1.jpg",
    name: "John Doe",
    pickUpLocation: "123 Main St",
    dropOffLocation: "456 Elm St",
    jobDate: "Tue, 10-10-2024",
    amount: "M50",
    postDate: "Wed, 02-10-2024",
  },
  {
    profilePhoto: "/path-to-profile-photo2.jpg",
    name: "Jane Smith",
    pickUpLocation: "789 Maple Ave",
    dropOffLocation: "101 Pine Rd",
    jobDate: "Wed, 11-10-2024",
    amount: "M75",
    postDate: "Tue, 01-10-2024",
  },
  {
    profilePhoto: "/path-to-profile-photo1.jpg",
    name: "Sasuke Uchiha",
    pickUpLocation: "Main North 1 Rd Maseru Lesotho",
    dropOffLocation: "456 Elm St",
    jobDate: "Tue, 06-10-2024",
    amount: "M60",
    postDate: "Wed, 04-10-2024",
  },
];

interface JobsRequestsTableProps {
  sortType: string; // Define the type for sortType
}

const JobsRequestsTable: React.FC<JobsRequestsTableProps> = ({ sortType }) => {
  const sortedData = [...jobRequestsData].sort((a, b) => {
    if (sortType === "mostRecent") {
      return new Date(b.postDate).getTime() - new Date(a.postDate).getTime(); // Sort by most recent postDate
    } else if (sortType === "highestPaying") {
      return parseFloat(b.amount.slice(1)) - parseFloat(a.amount.slice(1)); // Sort by highest amount
    }
    return 0; // Default case (no sorting)
  });

  return (
    <div className="py-4">
      <div className="flex flex-col">
        {sortedData.map((request, index) => (
          <JobsRequests
            key={index}
            profilePhoto={request.profilePhoto}
            name={request.name}
            pickUpLocation={request.pickUpLocation}
            dropOffLocation={request.dropOffLocation}
            jobDate={request.jobDate}
            amount={request.amount}
            postDate={request.postDate}
          />
        ))}
      </div>
    </div>
  );
};

export default JobsRequestsTable;
