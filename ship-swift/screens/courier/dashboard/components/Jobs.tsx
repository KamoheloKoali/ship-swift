"use client";
import React, { useState } from "react";
import JobsMenu from "./JobsMenu";
import JobsRequestsTable from "./JobsRequestsTable";

const Jobs = () => {
  const [sortType, setSortType] = useState("mostRecent"); // State for sort type

  // Function to handle sort type changes
  const handleSortChange = (newSortType: string) => {
    setSortType(newSortType); // Update the sort type based on user selection
  };

  return (
    <div>
      <h1 className="font-semibold text-lg py-8">Job Requests</h1>
      <JobsMenu onSortChange={handleSortChange} />{" "}
      {/* Pass the onSortChange prop */}
      <JobsRequestsTable sortType={sortType} /> {/* Pass the sortType prop */}
    </div>
  );
};

export default Jobs;
