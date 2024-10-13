"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import JobsMenu from "./JobsMenu";
import CardJobsInfo from "@/screens/courier/dashboard/components/CardJobsInfo";
import CardStatus from "@/screens/courier/dashboard/components/CardStatus";
import UserProfile from "@/screens/courier/profile/components/UserProfile";
import JobsRequestsTable, {
  JobRequest,
} from "@/screens/courier/dashboard/components/JobsRequestsTable";
import JobsInfoSheet from "@/screens/courier/dashboard/components/JobsInfoSheet";
import Profile from "@/screens/courier/profile/components/Profile";
import { getDriverByID } from "@/actions/driverActions"; // Adjust this import path as needed

const Jobs = () => {
  const { user } = useUser();
  const [sortType, setSortType] = useState("mostRecent");
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [driverData, setDriverData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!user) return;

      try {
        const data = await getDriverByID(user.id);
        setDriverData(data);
      } catch (err) {
        setError("Failed to fetch driver data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [user]);

  const handleSortChange = (newSortType: string) => {
    setSortType(newSortType);
  };

  const handleJobSelect = (job: JobRequest | null) => {
    setSelectedJob(job);
    setIsModalOpen(!!job);
  };

  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1441) {
        setIsSheetOpen(false);
      } else {
        setIsSheetOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-row justify-center lg:justify-start">
      <div className="hidden mylg:w-[2.5%] 2xl:w-[10%] lg:block"></div>

      <div className="flex flex-row w-full mylg:w-[95%] 2xl:w-[80%] justify-center">
        <div className="w-[98%] md:w-[80%] mylg:w-[72%]">
          {/* Render UserProfile or Profile based on isProfileOpen */}
          {isProfileOpen ? (
            <Profile
              onProfileClick={handleProfileClick}
              isProfileOpen={isProfileOpen}
              driverData={driverData}
            />
          ) : (
            <UserProfile
              onProfileClick={handleProfileClick}
              isProfileOpen={isProfileOpen}
              driverData={driverData}
            />
          )}

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
