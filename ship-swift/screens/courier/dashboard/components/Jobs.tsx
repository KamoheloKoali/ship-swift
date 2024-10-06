"use client";
import React, { useState, useEffect } from "react";
import JobsMenu from "./JobsMenu";
import CardJobsInfo from "@/screens/courier/dashboard/components/CardJobsInfo";
import CardStatus from "@/screens/courier/dashboard/components/CardStatus";
import UserProfile from "@/screens/courier/dashboard/components/UserProfile";
import JobsRequestsTable, {
  JobRequest,
} from "@/screens/courier/dashboard/components/JobsRequestsTable";
import JobsInfoSheet from "@/screens/courier/dashboard/components/JobsInfoSheet";

const Jobs = () => {
  const [sortType, setSortType] = useState("mostRecent");
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null); // State for selected job
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  const handleSortChange = (newSortType: string) => {
    setSortType(newSortType);
  };

  const handleJobSelect = (job: JobRequest | null) => {
    setSelectedJob(job);
    setIsModalOpen(!!job);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1441) {
        setIsSheetOpen(false); // Hide the sheet
      } else {
        setIsSheetOpen(true); // Show the sheet for smaller screens
      }
    };

    // Check screen size on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-row justify-center lg:justify-start">
      <div className="hidden mylg:w-[2.5%] 2xl:w-[10%] lg:block"></div>

      <div className="flex flex-row w-full mylg:w-[95%] 2xl:w-[80%] justify-center">
        <div className="w-[98%] md:w-[80%] mylg:w-[72%]">
          <UserProfile />
          <div className="flex md:hidden justify-start w-full">
            <CardStatus />
          </div>
          <h1 className="font-semibold text-lg py-8">Job Requests</h1>
          <JobsMenu onSortChange={handleSortChange} />
          <JobsRequestsTable
            sortType={sortType}
            onJobSelect={handleJobSelect}
          />
        </div>
        <div className="relative hidden mylg:block w-[28%] bg-muted/80">
          <CardStatus />
          <CardJobsInfo job={selectedJob} isOpen={isModalOpen} />
        </div>
      </div>

      <div className="hidden mylg:w-[2.5%] 2xl:w-[10%] lg:block"></div>

      <div className="hidden">
        {isSheetOpen && (
          <div className="shadcn-sheet">
            <JobsInfoSheet
              job={selectedJob}
              isOpen={isModalOpen}
              onOpenChange={setIsModalOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
