"use client";

import Details from "./JobDetails";
import RequestDetails from "./RequestDetails"; // New RequestDetails component
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
import { Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JobsTable from "./JobsTable";
import { Progress } from "@/components/ui/progress";
import {
  getAllActiveJobsByDriverId,
  updateActiveJobStatus,
} from "@/actions/activeJobsActions";
import { getUnapprovedJobRequests } from "@/actions/jobRequestActions";

export default function MyJobs() {
  const [jobs, setJobs] = useState<any[] | undefined>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobRequests, setJobRequests] = useState<any[] | undefined>([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [error, setError] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const response = await getAllActiveJobsByDriverId(userId || "");
      if (response && response.length > 0) {
        setJobs(response);
        setSelectedJob(response[0]);
      } else if (response) {
        setError("An unexpected error occurred");
      } else {
        setError("No response received");
      }
      setLoading(false);
    };

    fetchJobs();
  }, [userId]);

  useEffect(() => {
    const fetchJobRequests = async () => {
      if (userId) {
        const requests = await getUnapprovedJobRequests(userId);
        setJobRequests(requests);
        console.log(requests[0].CourierJob.collectionDate);
      }
    };

    fetchJobRequests();
  }, [userId]);

  const handleRowClick = (job: any | undefined) => {
    setSelectedJob(job);
    setSelectedRequest(null); // Clear selected request when a job is clicked
  };

  const handleRequestClick = (request: any | undefined) => {
    setSelectedRequest(request);
    setSelectedJob(null); // Clear selected job when a request is clicked
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await updateActiveJobStatus(jobId, newStatus);
      setJobs((prevJobs) =>
        prevJobs?.map((job) =>
          job.Id === jobId ? { ...job, jobStatus: newStatus } : job
        )
      );
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-muted/40">
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md">
          <Truck className="animate-truck" width="100" height="100" />
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      )}

      <div className="flex flex-col gap-4 p-4 md:py-4 md:px-6 lg:px-8">
        <main className="grid gap-4 md:gap-6 lg:gap-8">
          {/* Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>My Deliveries</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Get feedback of my progress
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Get feedback</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>This Week</CardDescription>
                <CardTitle className="text-4xl">M 0.00</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +25% from last week
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={25} aria-label="25% increase" />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>This Month</CardDescription>
                <CardTitle className="text-4xl">M 0.00</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +10% from last month
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={12} aria-label="12% increase" />
              </CardFooter>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <JobsTable
                jobs={jobs}
                jobRequests={jobRequests}
                onStatusChange={handleStatusChange}
                onRowClick={handleRowClick}
                onRequestClick={handleRequestClick}
              />
            </div>

            <div className="lg:col-span-1">
              {selectedJob ? (
                <Details job={selectedJob} />
              ) : selectedRequest ? (
                <RequestDetails request={selectedRequest} />
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
