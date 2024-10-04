import React from "react";
import JobsRequests from "./JobsRequests"; // Adjust the path as necessary

const jobRequestsData = [
  {
    profilePhoto: "/path-to-profile-photo1.jpg",
    name: "John Doe",
    pickUpLocation: "123 Main St",
    dropOffLocation: "456 Elm St",
    jobDate: "2024-10-15",
    amount: "$50",
    postDate: "2024-10-01",
  },
  {
    profilePhoto: "/path-to-profile-photo2.jpg",
    name: "Jane Smith",
    pickUpLocation: "789 Maple Ave",
    dropOffLocation: "101 Pine Rd",
    jobDate: "2024-10-16",
    amount: "$75",
    postDate: "2024-10-02",
  },
];

const JobsRequestsTable: React.FC = () => {
  return (
    <div className="py-4">
      <div className="flex flex-col">
        {jobRequestsData.map((request, index) => (
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
