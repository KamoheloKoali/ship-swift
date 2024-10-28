"use client";

import Details from "./JobDetails";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JobsTable from "./JobTables";

import { Progress } from "@/components/ui/progress";
import { getAllJobs } from "@/actions/courierJobsActions";
import { Loader2, Truck } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { getJobRequestsByCourierJobId } from "@/actions/jobRequestActions";
import { getDriverByID } from "@/actions/driverActions";

export default function MyJobs() {
  const [jobs, setJobs] = useState<any[] | undefined>([]);
  const [requests, setRequests] = useState<any[] | undefined>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [error, setError] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [isGettingDrivers, setIsGettingDrivers] = useState<boolean>(false); // Loading state
  const { userId } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true); // Start loading
      const response = await getAllJobs();
      if (response.success) {
        const data = response.data?.filter((job) => job.clientId === userId);
        setJobs(data);
      } else {
        setError(response.error);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const handleRowClick = async (job: any | undefined) => {
    setRequests([]);
    if (job.packageStatus === "unclaimed") {
      setIsGettingDrivers(true);
      const requests = await getJobRequestsByCourierJobId(job.Id);
      if (requests.length > 0) {
        let drivers = [];
        for (let request of requests) {
          drivers.push(request.Driver);
        }
        if (drivers.length > 0) {
          setRequests(drivers);
        }
      }
    }
    setIsGettingDrivers(false);
    setSelectedJob(job);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-muted/40">
      {/* Full-screen loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md">
          {/* Animated Delivery Truck */}
          <Truck className="animate-truck" width="100" height="100" />
          <p className="text-lg text-gray-700">____________________</p>
        </div>
      )}

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            {/* Render the table only when loading is false */}
            <JobsTable jobs={jobs} onRowClick={handleRowClick} />
          </div>

          {/* Display details if a job is selected */}
          {isGettingDrivers ? (
            <div className="w-full flex flex-col justify-center items-center h-full">
              <Truck className="animate-truck" width="100" height="100" />
              <p className="text-lg text-gray-700">____________________</p>
            </div>
          ) : (
            selectedJob && <Details job={selectedJob} requests={requests} />
          )}
        </main>
      </div>
    </div>
  );
}
