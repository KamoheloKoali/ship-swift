"use client";
import React from "react";
import JobsMenu from "./JobsMenu";
import JobsRequestsTable from "./JobsRequestsTable";
const Jobs = () => {
  return (
    <div>
      <h1 className="font-semibold text-lg py-8">Job Requests</h1>
      <JobsMenu />
      <JobsRequestsTable/>
    </div>
  );
};

export default Jobs;
